#pragma strict
var video : GameObject;
var heart : GameObject;
var hud : GameObject;
var player : GameObject;
var playerPrefab : GameObject;
var playerSpawnPoint : GameObject;
var fallRange : float = 20;

var textController : TextController;

enum State { Good, Neutral, Bad, Awful, Lost }
public var state : State;

function Start () {
	player = GameObject.Instantiate(playerPrefab, playerSpawnPoint.transform.position, Quaternion.identity);
	player.name = 'Player';
	var camera = GameObject.FindGameObjectWithTag('MainCamera');
	camera.transform.parent = player.transform;
	state = State.Neutral;
	textController = GameObject.FindObjectOfType(TextController);
	//Instantiate(
}

function Update () {
	/*
	1. make sure user isn't below death line
	2. continue to update timer
	3. maybe display word meter
	4. update heartbeat 
	*/
	if(player.transform.position.y < -10){
		GetNervous();
		player.transform.position = textController.speechObjectArray[textController.nextWord].transform.position + Vector3(0, 30, 0);
		player.rigidbody.constraints = RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
	}
}

function Relax () {
}

function GetNervous () {
	switch(state){
		case State.Good:
			break;
		case State.Neutral:
			break;
		case State.Bad:
			break;
		case State.Awful:
			break;
		case State.Lost:
			break;
	}
}