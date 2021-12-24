

fn get_distances(field: Vec<Vec<usize>>, start: (usize, usize))-> Vec<Vec<usize>> {
    let (start_x, start_y) = start;
    let mut costs: Vec<Vec<usize>> = vec![vec![usize::MAX; field[0].len()]; field.len()];
    let mut visited: Vec<Vec<bool>> = vec![vec![false; field[0].len()]; field.len()];
    costs[start_y][start_x] = 0;
    visited[start_y][start_x] = true;

    let mut big_x = 10;
    let mut big_y = 10;

    let mut run_count = 0;
    let mut last_node_visited = (0, 0); 
    loop {
        let mut min_node = (0, 0);
        let mut min_visit_cost = usize::MAX;

        let (x,y) = last_node_visited;

        let left_has_not_been_visited = x != 0 && !visited[y][x-1];
        let right_has_not_been_visited = x+1 < visited[0].len() && !visited[y][x+1];
        let top_has_not_been_visited = y != 0 && !visited[y-1][x];
        let bot_has_not_been_visited = y+1 < visited.len() && !visited[y+1][x];


        if left_has_not_been_visited {
            let left_costs = costs[y][x] + field[y][x-1];
            if left_costs < costs[y][x-1] {
                costs[y][x-1] = left_costs;
            }
        }
        if right_has_not_been_visited {
            let right_costs = costs[y][x] + field[y][x+1];
            if right_costs < costs[y][x+1] {
                costs[y][x+1] = right_costs;
            }
        }
        if top_has_not_been_visited {
            let top_costs = costs[y][x] + field[y-1][x];
            if top_costs < costs[y-1][x] {
                costs[y-1][x] = top_costs;
            }
        }
        if bot_has_not_been_visited {
            let bot_costs = costs[y][x] + field[y+1][x];
            if bot_costs < costs[y+1][x] {
                costs[y+1][x] = bot_costs;
            }
        }

        for y in 0..big_y {
            for x in 0..big_x {
                if !visited[y][x] {
                    if costs[y][x] < min_visit_cost {
                        min_node = (x, y);
                        min_visit_cost = costs[y][x];
                    }
                }
            }
        }


        let (min_x, min_y) = min_node;
        costs[min_y][min_x] = min_visit_cost;
        visited[min_y][min_x] = true;
        last_node_visited = (min_x, min_y);

        // perf
        if min_y + 1 >= big_y && min_y + 1 < field.len() {
            big_y+=1;
        }
        if min_x + 1 >= big_x && min_x + 1 < field[0].len(){
            big_x+=1;
        }
        //

        run_count += 1;
        if run_count == field.len() * field[0].len() {
            break;
        }
        println!("[{}] out of {}", big_x, field.len());
    }
    return costs;
}

fn main() {
    let field_single = include_str!("a15.txt")
        .lines()
        .map(|line|line
            .split("")
            .filter(|c|c.len() > 0)
            .map(|c| c.parse::<usize>().unwrap())
            .collect::<Vec<usize>>())
        .collect::<Vec<_>>();

    let mut field: Vec<Vec<usize>> = vec![vec![0; field_single[0].len()*5]; field_single.len()*5];
    for y in 0..field.len() {
        for x in 0..field[0].len() {
            let old_x = x % field_single[0].len();
            let old_y = y % field_single.len();
            let old_cost = field_single[old_y][old_x];
            let x_adder = (x as f64 / field_single[0].len() as f64).floor() as usize;
            let y_adder = (y as f64 / field_single.len() as f64).floor() as usize;
            let mut new_cost = (old_cost + x_adder + y_adder) % 10;
            if old_cost + x_adder + y_adder >= 10 {
                new_cost += 1;
            } 
            field[y][x] = new_cost;
        }
    }   

    let costs = get_distances(field,(0,0));
    println!("{}", costs[costs.len()-1][costs[0].len()-1])
}