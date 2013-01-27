#pragma strict
var video : GameObject;
var heart : GameObject;
var heartController : HeartController;
var hud : GameObject;
var player : GameObject;
var playerPrefab : GameObject;
var playerSpawnPoint : GameObject;
var fallRange : float = 20;

var textController : TextController;

enum State { Good, Neutral, Bad, Awful, Lost }
public var state : State;

function Start () {
	player = GameObject.Instantiate(playerPrefab, playerSpawnPoint.transform.position, Quaternion.Euler(0,90, 0));
	player.name = 'Player';
	var camera = GameObject.FindGameObjectWithTag('MainCamera');
	camera.transform.parent = player.transform;
	state = State.Neutral;
	textController = GameObject.FindObjectOfType(TextController);
	heartController = heart.GetComponent(HeartController);

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
			heartController.rates = 1;
			state = State.Neutral;
			break;
		case State.Neutral:
			heartController.rates = 2;
			state = State.Bad;
			break;
		case State.Bad:
			heartController.rates = 3;
			state = State.Awful;
			break;
		case State.Awful:
			heartController.rates = 4;
			state = State.Lost;
			break;
	}
}