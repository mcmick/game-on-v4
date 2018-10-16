<?php

/**
 * Returns an array containing data for the user's current and next rank.
 *
 * Uses the user's "go_rank" meta data value to return the name and point threshold of the current
 * and next rank.
 *
 * @since 2.4.4
 *
 * @param  int $user_id The user's id.
 * @return array Returns an array of defaults on when the user's "go_rank" meta data is empty. 
 * 				 On success, returns array of rank data.
 */
function go_get_rank ( $user_id ) {
	if ( empty( $user_id ) ) {
		return;
	}
    $go_current_xp = intval(go_get_user_loot( $user_id, 'xp' ));
    $rank_count = get_option('options_go_loot_xp_levels_level');
    $i = $rank_count - 1; //account for count starting at 0
    while ( $i >= 0 ) {

        $xp = intval(get_option('options_go_loot_xp_levels_level_' . $i . '_xp'));
        if ($go_current_xp >= $xp){
            $current_rank = get_option('options_go_loot_xp_levels_level_' . $i . '_name');
            $current_rank_points = $xp;
            $next_rank_points = get_option('options_go_loot_xp_levels_level_' . ($i +1) . '_xp');
            $next_rank = get_option('options_go_loot_xp_levels_level_' . ($i +1) . '_name');
            break;
        }
        $i--;
    }

		return array(
			'current_rank' 		  => $current_rank,
			'current_rank_points' => $current_rank_points,
			'next_rank' 		  => $next_rank,
			'next_rank_points' 	  => $next_rank_points,
            'rank_num'            => ($i + 1)
		);
}

?>