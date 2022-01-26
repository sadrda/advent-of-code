#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

const int PACK_SIZE = 18;
const int PACK_NUM = 14;

struct Sub_program_input {
    bool a;
    long long b;
    long long c;
};

void apply_command(unordered_map<string, long long>& vars, vector<string> command) {
    string type = command[0];
    string var1 = command[1];
    string var2 = command[2];


    long long var2_val;
    if(var2 == "w" || var2 == "x" || var2 == "y" || var2 == "z") {
        var2_val = vars[var2];
    }
    else {
        var2_val = stoi(var2);
    }

    if(type == "mod") {
        vars[var1] = vars[var1] % var2_val;
    }
    if(type == "mul") {
        vars[var1] *= var2_val;
    }
    if(type == "add") {
        vars[var1] += var2_val;
    }
    if(type == "div") {
        vars[var1] /= var2_val;
    }
    if(type == "eql") {
        vars[var1] = vars[var1] == var2_val ? 1 : 0;
    }  
}

void forward_z(unordered_map<string, long long>& vars, Sub_program_input input) {
    long long oldZ = vars["z"];
    if (input.a) {
        vars["z"] /= 26;
    }

    if (oldZ % 26 + input.b != vars["w"]) {
        vars["z"] *= 26; 
        vars["z"] += vars["w"] + input.c; 
    } 
}

int main() {

    ifstream infile("a24.txt");
    string line;
    vector<vector<string> > commands;

    while (getline(infile, line)) {
        istringstream iss(line);
        vector<string> command;
        string input;
        while(iss >> input) {
            command.push_back(input);
        }
        commands.push_back(command);
    }

    vector<Sub_program_input> sub_program_inputs;
    for(int pack_id = 0; pack_id < PACK_NUM; pack_id++) {
        Sub_program_input sub_program_input;
        sub_program_input.a = commands[pack_id * PACK_SIZE + 4][2] == "26";
        sub_program_input.b = stoi(commands[pack_id * PACK_SIZE + 5][2]);
        sub_program_input.c = stoi(commands[pack_id * PACK_SIZE + 15][2]); 
        sub_program_inputs.push_back(sub_program_input);
    }


    vector<int> stacked_pack_ids;
    vector<long long> stacked_cons;
    int digits[14];

    for(int pack_id = 0; pack_id < PACK_NUM; pack_id++) {
        Sub_program_input sub_program_input = sub_program_inputs[pack_id];
        if(!sub_program_input.a) {
            stacked_pack_ids.push_back(pack_id);
            stacked_cons.push_back(sub_program_input.c);
        }
        else {
            int old_pack_id = stacked_pack_ids.back();
            int old_con = stacked_cons.back();
            stacked_pack_ids.pop_back();
            stacked_cons.pop_back();

            long long offset = old_con + sub_program_input.b;
            digits[old_pack_id] = max(1ll, 1ll - offset);
            digits[pack_id] = digits[old_pack_id] + offset;
        }
    }


    unordered_map<string, long long> vars;
    vars["x"] = 0ll;
    vars["y"] = 0ll;
    vars["z"] = 0ll;

    for(int pack_id = 0; pack_id < PACK_NUM; pack_id++) {
        vars["w"] = digits[pack_id];
        for(int i = 1; i < PACK_SIZE; i++) {
            vector<string> command = commands[i + PACK_SIZE * pack_id];
            apply_command(vars, command); 
        }
        cout << "ID: " << pack_id << endl;
        cout << sub_program_inputs[pack_id].a << " " << sub_program_inputs[pack_id].b << " "<< sub_program_inputs[pack_id].c << endl;
        cout << vars["w"] << " " << vars["x"] << " " << vars["y"] << " " << vars["z"] << endl;
        cout << "-------" << endl;
    }

    string digitsString = "";
    for(int i = 0; i < 14; i++) {
        digitsString += to_string(digits[i]);
    }
    cout << digitsString << endl;
}