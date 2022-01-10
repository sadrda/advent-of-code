#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

using namespace std;

int main() {
    ifstream infile("a22.txt");
    string line;
    while (getline(infile, line))
    {
        istringstream iss(line);
        string input;
        if (!(iss >> input)) { break; } 
        cout << input << endl;
    }
}