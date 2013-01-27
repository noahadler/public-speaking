#pragma strict

private var beatTimer : float = 0;
var maxShrink = 0.4;
var hbps : float[] = [1.0, 1/2, 1/4, 1/9, 0];
var rates : int;

function Start () {
	rates = 1;
}

function Update () {
	//Debug.Log(rates+'rates');
		

	if(rates!=4) {
		if(beatTimer < hbps[rates]/2){
			transform.localScale.x = 1-Mathf.Lerp(0, maxShrink, beatTimer/(hbps[rates]/2));
		}
		else if (beatTimer > hbps[rates]/2){
			transform.localScale.x = Mathf.Lerp(1-maxShrink, 1, (beatTimer-hbps[rates]/2)/(hbps[rates]/2));
		}
		beatTimer = ( beatTimer + Time.deltaTime ) % hbps[rates];
	}
	else
		beatTimer = 0;
}