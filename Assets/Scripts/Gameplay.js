#pragma strict
var video : GameObject;
var heart : GameObject;
var hud : GameObject;
var player : GameObject;
var playerPrefab : GameObject;
var playerSpawnPoint : GameObject;

function Start () {
	player = GameObject.Instantiate(playerPrefab, playerSpawnPoint.transform.position, Quaternion.identity);
	player.name = 'Player';
	//Instantiate(
}

function Update () {

}