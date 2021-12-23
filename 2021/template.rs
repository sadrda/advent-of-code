use std::fs;

fn main() {
    let data = fs::read_to_string("aXX.txt").expect("Unable to read file");
}