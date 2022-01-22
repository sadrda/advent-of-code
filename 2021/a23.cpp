#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

unordered_map<string, unsigned int> graph_costs;
unsigned int smallest_solve = numeric_limits<unsigned int>::max();  

struct Graph {
    vector<char> siderooms;
    vector<vector<char> > slots;
};

ostream& operator << (ostream &o, Graph& g){
    o << g.siderooms[0] << g.siderooms[1] << " " << g.siderooms[2] << " " << g.siderooms[3] << " " << g.siderooms[4] << " " << g.siderooms[5] << g.siderooms[6] << endl;
    for(int i = 0; i < g.slots.size(); i++) {
        o << " " << " " << g.slots[0][i] << " " << g.slots[1][i] << " " << g.slots[2][i] << " " << g.slots[3][i] << " " << " " << endl;
    }
    return o;
}

void solve(Graph graph, unsigned long cost);

char get_elem_from_slot_index(int slot_index) {
    if(slot_index == 0) return 'A';
    if(slot_index == 1) return 'B';
    if(slot_index == 2) return 'C';
    if(slot_index == 3) return 'D';
    throw new runtime_error("slot index out of bounds");
}

int get_slot_index_from_elem(char elem) {
    if(elem == 'A') return 0;
    if(elem == 'B') return 1;
    if(elem == 'C') return 2;
    if(elem == 'D') return 3;
    throw new runtime_error("invalid char");
}

bool is_free_path (Graph graph, unsigned int sideroom_index, unsigned int slot_index, unsigned int slot_position) {

    vector<char> slot = graph.slots[slot_index];
    for(int i = 0; i < slot_position; i++) {
        if(slot[i] != ' ') return false;
    }

    float positional_slot_index = 1.5f + (float)slot_index;
    
    if(sideroom_index < positional_slot_index) {
        for(int i = sideroom_index + 1; i < positional_slot_index; i++) {
            if(graph.siderooms[i] != ' ') return false;
        }
    }
    
    else {
        for(int i = sideroom_index - 1; i > positional_slot_index; i--) {
            if(graph.siderooms[i] != ' ') return false;
        }
    }
    return true;
}

 bool is_solved(Graph graph) {
    for(int i = 0; i < graph.slots.size(); i++) {
        vector<char> slot = graph.slots[i];
        char elem = get_elem_from_slot_index(i);

        for(int j = 0; j < slot.size(); j++) {
            if(slot[j] != elem) return false;
        }
    }
    return true;
}


int get_multiplier(char elem) {
    switch(elem) {
        case('A'): return 1;
        case('B'): return 10;
        case('C'): return 100;
        case('D'): return 1000;
    }
    return -1;
}

int get_steps(int sideroom_index, int slot_index, int slot_position) {
    int sideroom_distance;
    if(slot_index == 0) {
        if(sideroom_index == 0) sideroom_distance = 2;
        if(sideroom_index == 1) sideroom_distance = 1;
        if(sideroom_index == 2) sideroom_distance = 1;
        if(sideroom_index == 3) sideroom_distance = 3;
        if(sideroom_index == 4) sideroom_distance = 5;
        if(sideroom_index == 5) sideroom_distance = 7;
        if(sideroom_index == 6) sideroom_distance = 8;
    }

    if(slot_index == 1) {
        if(sideroom_index == 0) sideroom_distance = 4;
        if(sideroom_index == 1) sideroom_distance = 3;
        if(sideroom_index == 2) sideroom_distance = 1;
        if(sideroom_index == 3) sideroom_distance = 1;
        if(sideroom_index == 4) sideroom_distance = 3;
        if(sideroom_index == 5) sideroom_distance = 5;
        if(sideroom_index == 6) sideroom_distance = 6;
    }

    if(slot_index == 2) {
        if(sideroom_index == 0) sideroom_distance = 6;
        if(sideroom_index == 1) sideroom_distance = 5;
        if(sideroom_index == 2) sideroom_distance = 3;
        if(sideroom_index == 3) sideroom_distance = 1;
        if(sideroom_index == 4) sideroom_distance = 1;
        if(sideroom_index == 5) sideroom_distance = 3;
        if(sideroom_index == 6) sideroom_distance = 4;
    }

    if(slot_index == 3) {
        if(sideroom_index == 0) sideroom_distance = 8;
        if(sideroom_index == 1) sideroom_distance = 7;
        if(sideroom_index == 2) sideroom_distance = 5;
        if(sideroom_index == 3) sideroom_distance = 3;
        if(sideroom_index == 4) sideroom_distance = 1;
        if(sideroom_index == 5) sideroom_distance = 1;
        if(sideroom_index == 6) sideroom_distance = 2;
    }
    return sideroom_distance + slot_position + 1;
}


void sideroom_to_slot(Graph graph, unsigned long cost, int sideroom_index, char elem, int slot_index, int slot_position) {
    graph.siderooms[sideroom_index] = ' ';
    graph.slots[slot_index][slot_position] = elem;

    unsigned long new_cost = cost + get_multiplier(elem) * get_steps(sideroom_index, slot_index, slot_position);
    solve(graph, new_cost);
}


void sideroom_to_slots(Graph graph, unsigned long cost, int sideroom_index, char elem) {
    int slot_index = get_slot_index_from_elem(elem);
    vector<char> slot = graph.slots[slot_index];
    for(int slot_position = 0; slot_position < slot.size(); slot_position++) {
        if(slot[slot_position] == ' ' && is_free_path(graph, sideroom_index, slot_index, slot_position)) {
            bool lower_slot_positions_are_filled_correctly = true;
            for(int k = slot_position + 1; k < slot.size(); k++) {
                if(slot[k] != elem) {
                    lower_slot_positions_are_filled_correctly = false;
                    break;
                }
            }
            if(lower_slot_positions_are_filled_correctly) {
                sideroom_to_slot(graph, cost, sideroom_index, elem, slot_index, slot_position);
            }
        }
    }
}
 
void siderooms_to_slots(Graph graph, unsigned long cost) {
    for(int i = 0; i < graph.siderooms.size(); i++) {
        char elem = graph.siderooms[i];
        if(elem != ' ') {
            sideroom_to_slots(graph, cost, i, elem);
        }
    }
}

void slot_to_sideroom(Graph graph, unsigned long cost, int sideroom_index, int slot_index, int slot_position, char elem) {
    graph.siderooms[sideroom_index] = elem;
    graph.slots[slot_index][slot_position] = ' ';
    
    unsigned long new_cost = cost + get_multiplier(elem) * get_steps(sideroom_index, slot_index, slot_position);
    solve(graph, new_cost);
}

void slot_to_siderooms(Graph graph, unsigned long cost, int slot_index, int slot_position, char elem) {
    for(int i = 0; i < graph.siderooms.size(); i++) {
        if(graph.siderooms[i] == ' ' && is_free_path(graph, i, slot_index, slot_position)) slot_to_sideroom(graph, cost, i, slot_index, slot_position, elem);
    }
}

void slots_to_siderooms(Graph graph, unsigned long cost) {
    for(int i = 0; i < graph.slots.size(); i++) {
        vector<char> slot = graph.slots[i];
        char correct_elem = get_elem_from_slot_index(i);
        for(int j = 0; j < slot.size(); j++) {
            if(slot[j] == ' ') continue;

            bool will_continue = false;
            for(int k = 0; k < j; k++) {
                if(slot[k] != ' ') {
                    will_continue = true;
                }
            }
            if(will_continue) continue;

            if(slot[j] != correct_elem) slot_to_siderooms(graph, cost, i, j, slot[j]);
            else {
                for(int k = j; k < slot.size(); k++) {
                    if(slot[k] != correct_elem) {
                        slot_to_siderooms(graph, cost, i, j, slot[j]);
                        break;
                    }
                }
            }
        }
    }    
}
 
string get_graph_notation(Graph graph) {
    string graph_notation = "";

    for(int i = 0; i < graph.siderooms.size(); i++) {
        graph_notation.push_back(graph.siderooms[i]);
    }

    for(int i = 0; i < graph.slots.size(); i++) {
        vector<char> slot = graph.slots[i];
        for(int j = 0; j < slot.size(); j++){
            graph_notation.push_back(slot[j]);
        }
    } 
 
    return graph_notation;
} 

void solve(Graph graph, unsigned long cost) {
    if(cost >= smallest_solve) {
        return;
    }

    string graph_notation = get_graph_notation(graph);
    unsigned int graph_cost = graph_costs[graph_notation]; 
    if(graph_cost) {
        if(graph_cost > cost) {
            graph_costs[graph_notation] = cost;
        }
        else {
            return;
        }
    }
    else {
        graph_costs[graph_notation] = cost;
    }

    if(is_solved(graph) && cost < smallest_solve) {
        smallest_solve = cost;
        return;
    }

    siderooms_to_slots(graph, cost);
    slots_to_siderooms(graph, cost);
} 

int main() {
    Graph graph;
    for(int i = 0; i < 7; i ++){
        graph.siderooms.push_back(' ');
    }

    vector<char> slot_a;
    slot_a.push_back('A');
    slot_a.push_back('D');
    slot_a.push_back('D');
    slot_a.push_back('C');

    vector<char> slot_b;
    slot_b.push_back('D');
    slot_b.push_back('C');
    slot_b.push_back('B');
    slot_b.push_back('D');

    vector<char> slot_c;
    slot_c.push_back('A');
    slot_c.push_back('B');
    slot_c.push_back('A');
    slot_c.push_back('B');

    vector<char> slot_d;
    slot_d.push_back('C');
    slot_d.push_back('A');
    slot_d.push_back('C');
    slot_d.push_back('B');
    
    graph.slots.push_back(slot_a);
    graph.slots.push_back(slot_b);
    graph.slots.push_back(slot_c);
    graph.slots.push_back(slot_d);

    solve(graph, 0);
    
    cout << smallest_solve << endl;
}  