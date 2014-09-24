<?php
error_reporting(-1); // Report all PHP errors

header('Content-Type: application/json; charset=utf-8', true,200);

$ps = array();
if (isset($_GET['pg'])) {
	$ps['pg'] = 'pg=' . ((int) $_GET['pg']);
}
if (isset($_GET['q'])) {
	$ps['q'] = 'q=' . ((int) $_GET['q']);
}
if (isset($_GET['K2'])) {
	$ps['K2'] = 'K2=' . ((int) $_GET['K2']);
}
if (isset($_GET['chi'])) {
	$ps['chi'] = 'chi=' . ((int) $_GET['chi']);
}
if (isset($_GET['e'])) {
	$ps['e'] = 'e=' . ((int) $_GET['e']);
}
if (isset($_GET['h11'])) {
	$ps['h11'] = 'h11=' . ((int) $_GET['h11']);
}

try {
	$db = new PDO('sqlite:surfaces.db');
	$out = array();

	$qs = implode(' AND ', array_values($ps));
	if ($qs == '') {
		$qs = "1";
	}
	$result = $db->query('SELECT * FROM invariants WHERE ' . $qs . ' LIMIT 1;');
	foreach($result as $row) {
		for ($i = 0; $i < 6; $i++) {
			unset($row[$i]);
		}
		$out['invariants'] = $row;
	}
	foreach(array('pg','q','K2','chi','e','h11') as $k) {
		$pscopy = $ps;
		unset($pscopy[$k]);
		$qs = implode(' AND ', array_values($pscopy));
		if ($qs == '') {
			$qs = "1";
		}
		$result = $db->query('SELECT DISTINCT ' . $k . ' FROM invariants WHERE ' . $qs . ' ORDER BY ' . $k .';');
		$arr = array();
		foreach($result as $row) {
			$arr[] = $row[0];
		}
		$out['values'][$k] = $arr;
	}
	$a = array();
	foreach(array('pg','q','K2','chi','e','h11') as $k) {
		if (array_key_exists($k, $ps)) {
			$a[] = $ps[$k];
		} else {
			$a[] = '(' . $k . '=' . $out['invariants'][$k] . ' OR ' . $k . '=NULL)';
		}
	}
	$qs = implode(' AND ', $a);
	$result = $db->query('SELECT ref FROM bibliography WHERE ' . $qs . ' ORDER BY sp DESC;');
	$arr = array();
	foreach($result as $row) {
		$arr[] = $row[0];
	}
	$out['references'] = $arr;

	echo json_encode($out);
} catch(PDOException $e) {
	echo '{ "error" : "' . json_encode($e->getMessage()) . '" }';
}
?>
