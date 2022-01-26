#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

using namespace std;

int main() {
    ifstream infile("a25.txt");
    string line;
    vector<vector<char> > field;

    while (getline(infile, line)) {
        istringstream iss(line);
        string input;
        while(iss >> input) {
            vector<char> row;
            for(int i = 0; i < input.size(); i++) {
                row.push_back(input[i]);
            }
            field.push_back(row);
        }
    }

    bool cucumber_moving = true;
    unsigned long steps = 0;
    int x_max = field[0].size();
    int y_max = field.size();

    while(cucumber_moving) {
        steps++;
        cucumber_moving = false;
        vector<vector<char> > new_field = field;
        for(int y = 0; y < y_max; y++) {
            for(int x = 0; x < x_max; x++) {
                int new_x_pos = (x + 1) % x_max;
                if(field[y][x] == '>' && field[y][new_x_pos] == '.') {
                    new_field[y][x] = '.';
                    new_field[y][new_x_pos] = '>';
                    cucumber_moving = true;
                }
            }
        }
        field = new_field;

        for(int y = 0; y < y_max; y++) {
            for(int x = 0; x < x_max; x++) {
                int new_y_pos = (y + 1) % y_max;
                if(field[y][x] == 'v' && field[new_y_pos][x] == '.') {
                    new_field[y][x] = '.';
                    new_field[new_y_pos][x] = 'v';
                    cucumber_moving = true;
                }
            }
        }
        field = new_field;
    }
    cout << steps << endl;
}