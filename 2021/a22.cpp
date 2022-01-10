#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

struct rule {
    bool status;
    pair<int,int> x;
    pair<int,int> y;
    pair<int,int> z;
    int depth;
};

int get_value_from_range(string& range_raw) {
    int pos = range_raw.find("..");
    int value = stoi(range_raw.substr(0, pos));
    if(pos != string::npos) {
        pos += 2;
    }
    range_raw.erase(0, pos);
    return value;
}

pair<int,int> get_pair_from_ranges(string& ranges_raw) {
    ranges_raw.erase(0, 2);
    size_t pos = ranges_raw.find(","); 
    string range_raw = ranges_raw.substr(0, pos);

    int a = get_value_from_range(range_raw);
    int b = get_value_from_range(range_raw);

    ranges_raw.erase(0, pos + 1);
    return make_pair(a, b);
}

long long get_volume(rule c) {
    return  (1ll+abs(c.x.second-c.x.first)) * 
            (1ll+abs(c.y.second-c.y.first)) *
            (1ll+abs(c.z.second-c.z.first));
}

rule get_intersection(rule r1, rule r2) {
    rule intersection;
    intersection.x.first = max(r1.x.first, r2.x.first);
    intersection.x.second = min(r1.x.second, r2.x.second);
    intersection.y.first = max(r1.y.first, r2.y.first);
    intersection.y.second = min(r1.y.second, r2.y.second);
    intersection.z.first = max(r1.z.first, r2.z.first);
    intersection.z.second = min(r1.z.second, r2.z.second);
    intersection.depth = max(r1.depth, r2.depth) + 1;
    return intersection;
}

void fill_intersections(vector<rule>& intersections, rule r1) {
    vector<rule> new_intersections;
    for(int i = 0; i < intersections.size(); i++) {
        rule r2 = intersections[i];
        // r1 not intersecting r2
        if(
            r1.x.second < r2.x.first || r1.x.first > r2.x.second ||
            r1.y.second < r2.y.first || r1.y.first > r2.y.second ||
            r1.z.second < r2.z.first || r1.z.first > r2.z.second 
        ) {
            continue;
        }
        rule intersection = get_intersection(r1,r2);
        new_intersections.push_back(intersection);
    }
    for(int i = 0; i < new_intersections.size(); i++) {
        intersections.push_back(new_intersections[i]);
    }
}

int main() {
    ifstream infile("a22.txt");
    string line, status, ranges_raw;

    vector<rule> rules;
    while (getline(infile, line)) {
        pair<int, int> x,y,z;
        struct rule curr_rule;

        istringstream iss(line);
        if (!(iss >> status >> ranges_raw)) { break; }         
        curr_rule.x=get_pair_from_ranges(ranges_raw);      
        curr_rule.y=get_pair_from_ranges(ranges_raw);      
        curr_rule.z=get_pair_from_ranges(ranges_raw); 
        curr_rule.status = status == "on"; 
        curr_rule.depth = 0;
        rules.push_back(curr_rule);   
    }

    long long sum = 0;
        
    for(int i = 0; i < rules.size(); i++) {
        rule curr_rule = rules[i];
        if(!curr_rule.status) continue;
        
        long long curr_sum = get_volume(curr_rule);
            
        vector<rule> intersections;
        for(int j = i+1; j < rules.size(); j++) {
            rule check_rule = rules[j];  

            //curr_rule is completely overlapped by check_rule           
            if(
                curr_rule.x.first >= check_rule.x.first && curr_rule.x.second <= check_rule.x.second && 
                curr_rule.y.first >= check_rule.y.first && curr_rule.y.second <= check_rule.y.second && 
                curr_rule.z.first >= check_rule.z.first && curr_rule.z.second <= check_rule.z.second
            ) {
                curr_sum = 0;
                intersections.clear();
                break;
            } 

            // curr_rule not intersecting check_rule
            if(
                curr_rule.x.second < check_rule.x.first || curr_rule.x.first > check_rule.x.second ||
                curr_rule.y.second < check_rule.y.first || curr_rule.y.first > check_rule.y.second ||
                curr_rule.z.second < check_rule.z.first || curr_rule.z.first > check_rule.z.second 
            ) {
                continue;
            }
            fill_intersections(intersections, check_rule);
            intersections.push_back(get_intersection(curr_rule,check_rule));
        }

        for(int j = 0; j < intersections.size(); j++) {
            rule intersection = intersections[j];  
            unsigned long long volume = get_volume(intersection);
            if(intersection.depth % 2) {
                curr_sum -= volume;
            }
            else {
                curr_sum += volume;
            }
        }
        sum += curr_sum;
    }
    cout <<  sum << endl; 
}