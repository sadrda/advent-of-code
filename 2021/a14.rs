use std::collections::HashMap;

fn grow(pair_count: &HashMap<String, u64>, rules: &Vec<(String,String)>) -> HashMap<String, u64>  {
    let mut new_pair_count = HashMap::<String, u64>::new();
    for (pair, _count) in pair_count {
        new_pair_count.insert(pair.to_string(), 0);
    }

    for (pair, count) in pair_count {
        for rule in rules {
            if &rule.0.to_string() == pair {
                let new_pair_one = pair[0..1].to_string() + &rule.1;
                let new_pair_two = rule.1.to_owned() + &pair[1..2].to_string();
                let new_pair_slice_one: &str = &new_pair_one[..];
                let new_pair_slice_two: &str = &new_pair_two[..];
                new_pair_count.insert(new_pair_slice_one.to_string(), count + new_pair_count[new_pair_slice_one]);
                new_pair_count.insert(new_pair_slice_two.to_string(), count + new_pair_count[new_pair_slice_two]);
            }
        }
    }
    return new_pair_count;
}

fn main() {
    let (polymer, unsplit_rules) = include_str!("a14.txt").split_once("\n\n").unwrap();
    let polymer = polymer.to_string();
    let rules = unsplit_rules
        .lines()
        .map(|r| {let (key, value) = r.split_once(" -> ").unwrap(); (key.to_string(), value.to_string())})
        .collect::<Vec<_>>();

    let mut pair_count = HashMap::<String, u64>::new();
    
    for rule in &rules {
        pair_count.insert(rule.0.to_string(), 0);
    }

    for n in 0..polymer.len()-1 {
        let polymer_pair = &polymer[n..n+2];
        pair_count.insert(polymer_pair.to_string(), pair_count[polymer_pair]+1);
    }

    for _ in 0..40 {
        pair_count = grow(&pair_count, &rules);
    }

    let mut char_count_doubled = HashMap::<String, u64>::new();
    for (pair_one, _count) in &pair_count {
        let pair_one_char_one = &pair_one[0..1];
        let pair_one_char_two = &pair_one[1..2];
        let mut char_one_count = 0;
        let mut char_two_count = 0;
        for (pair_two, count) in &pair_count {
            let pair_two_char_one = &pair_two[0..1];
            let pair_two_char_two = &pair_two[1..2];
        
            if pair_two_char_one == pair_one_char_one && pair_two_char_two == pair_one_char_one {
                char_one_count += 2*count;
            }
            else if pair_two_char_one == pair_one_char_one || pair_two_char_two == pair_one_char_one {
                char_one_count += count;
            }
            if pair_two_char_one == pair_one_char_two && pair_two_char_two == pair_one_char_two {
                char_two_count += 2*count;
            }
            else if pair_two_char_one == pair_one_char_two || pair_two_char_two == pair_one_char_two {
                char_two_count += count;
            }
            
        }
        char_count_doubled.insert(pair_one_char_one.to_string(), char_one_count);
        char_count_doubled.insert(pair_one_char_two.to_string(), char_two_count);
    }
    char_count_doubled.insert(polymer[0..1].to_string(), char_count_doubled[&polymer[0..1]]+1);
    char_count_doubled.insert(polymer[polymer.len()-1..polymer.len()].to_string(), char_count_doubled[&polymer[polymer.len()-1..polymer.len()]]+1);

    let mut char_count = char_count_doubled.clone();
    for (curr_char, count) in &char_count_doubled { 
        char_count.insert(curr_char.to_string(), count/2);
    }


    let mut max_char_count = u64::MIN;
    let mut min_char_count = u64::MAX;
    for (_char, count) in char_count {
        if count > max_char_count {
            max_char_count = count;
        }
        if count < min_char_count {
            min_char_count = count;
        }
    }

    println!("{:?}", max_char_count - min_char_count); 
}