fn play(player1_score:u16, player2_score:u16, player1_pos:u16, player2_pos:u16, next_player:u16)->(u64, u64) {   
    if player1_score >= 21{
        return (1, 0);
    }
    if player2_score >= 21{
        return (0, 1);
    }

    if next_player == 1 {
        let new_pos3 = (player1_pos + 2) % 10 + 1;
        let new_pos4 = (player1_pos + 3) % 10 + 1;
        let new_pos5 = (player1_pos + 4) % 10 + 1;
        let new_pos6 = (player1_pos + 5) % 10 + 1;
        let new_pos7 = (player1_pos + 6) % 10 + 1;
        let new_pos8 = (player1_pos + 7) % 10 + 1;
        let new_pos9 = (player1_pos + 8) % 10 + 1;

        let (p1wins3, p2wins3) = play(player1_score+new_pos3,player2_score,new_pos3,player2_pos,2);
        let (p1wins4, p2wins4) = play(player1_score+new_pos4,player2_score,new_pos4,player2_pos,2);
        let (p1wins5, p2wins5) = play(player1_score+new_pos5,player2_score,new_pos5,player2_pos,2);
        let (p1wins6, p2wins6) = play(player1_score+new_pos6,player2_score,new_pos6,player2_pos,2);
        let (p1wins7, p2wins7) = play(player1_score+new_pos7,player2_score,new_pos7,player2_pos,2);
        let (p1wins8, p2wins8) = play(player1_score+new_pos8,player2_score,new_pos8,player2_pos,2);
        let (p1wins9, p2wins9) = play(player1_score+new_pos9,player2_score,new_pos9,player2_pos,2);

        return (p1wins3+3*p1wins4+6*p1wins5+7*p1wins6+6*p1wins7+3*p1wins8+p1wins9,p2wins3+3*p2wins4+6*p2wins5+7*p2wins6+6*p2wins7+3*p2wins8+p2wins9);
    }
    else {
        let new_pos3 = (player2_pos + 2) % 10 + 1;
        let new_pos4 = (player2_pos + 3) % 10 + 1;
        let new_pos5 = (player2_pos + 4) % 10 + 1;
        let new_pos6 = (player2_pos + 5) % 10 + 1;
        let new_pos7 = (player2_pos + 6) % 10 + 1;
        let new_pos8 = (player2_pos + 7) % 10 + 1;
        let new_pos9 = (player2_pos + 8) % 10 + 1;

        let (p1wins3, p2wins3) = play(player1_score,player2_score+new_pos3,player1_pos,new_pos3,1);
        let (p1wins4, p2wins4) = play(player1_score,player2_score+new_pos4,player1_pos,new_pos4,1);
        let (p1wins5, p2wins5) = play(player1_score,player2_score+new_pos5,player1_pos,new_pos5,1);
        let (p1wins6, p2wins6) = play(player1_score,player2_score+new_pos6,player1_pos,new_pos6,1);
        let (p1wins7, p2wins7) = play(player1_score,player2_score+new_pos7,player1_pos,new_pos7,1);
        let (p1wins8, p2wins8) = play(player1_score,player2_score+new_pos8,player1_pos,new_pos8,1);
        let (p1wins9, p2wins9) = play(player1_score,player2_score+new_pos9,player1_pos,new_pos9,1);

        return (p1wins3+3*p1wins4+6*p1wins5+7*p1wins6+6*p1wins7+3*p1wins8+p1wins9,p2wins3+3*p2wins4+6*p2wins5+7*p2wins6+6*p2wins7+3*p2wins8+p2wins9);
    }
}

fn main() {
    let (p1wins, p2wins) = play(0,0,1,10,1);
    println!("{}", std::cmp::max(p1wins,p2wins));
}