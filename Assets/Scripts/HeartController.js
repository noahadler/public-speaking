#pragma strict

var beatTime : float = 1;
private var beatTimer : float = 0;
var maxShrink = 0.3;

function Start () {

}

function Update () {
	if(beatTimer < beatTime/2){
		transform.localScale.x = 1 - maxShrink * (beatTimer * 2 / beatTime);
	}
	else if (beatTimer > beatTime/2){
		transform.localScale.x = (1 - maxShrink) + maxShrink * ((beatTimer-beatTime/2) * 2 / beatTime);
	}
	
	
	beatTimer = ( beatTimer + Time.deltaTime ) % beatTime;
}