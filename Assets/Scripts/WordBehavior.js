#pragma strict
private var lifetime : float = 4;
private var currLifetime : float;
var activated : boolean = false;
var correctWord : boolean;
var direction : int = 0;
var textController : TextController;
//var fader : Fade;
var colorSet : Color[] = [	new Color(45.0/255, 215.0/255, 0),
							new Color(133.0/255, 235.0/255, 106.0/255),
							new Color(245.0/255, 0, 29.0/255),
							new Color(250.0/255, 112.0/255, 128.0/255)];

function Start () {
	textController = GameObject.FindObjectOfType(TextController);
}

function Update () {
	if(activated)
		Decay();
}

function OnCollisionEnter ( collision : Collision ) {
	Debug.Log(collision.other.gameObject.tag);
	if(!activated && collision.other.gameObject.CompareTag('Player')) {
		currLifetime = lifetime;
		activated = true;
		correctWord = textController.LandedOn(int.Parse(this.gameObject.name));
		if(correctWord){
			gameObject.renderer.material.color = colorSet[0];
			//Fade.use.Colors(gameObject.renderer.material, Color.white, Color.green, lifetime/6);
			direction = 1;
		}
		else {
			gameObject.renderer.material.color = colorSet[2];
			direction = -1;
		}
		var colors;
		if(correctWord)
			colors = [colorSet[0], colorSet[1]];
		else
			colors = [colorSet[2], colorSet[3]];
		Fade.use.Colors(gameObject.renderer.material, colors, 0.2, true);
		Fade.use.Alpha(gameObject.renderer.material, 1.0, 0.0, lifetime);	
	}
}

var t : float = 0;
function Decay () {
	while(currLifetime>0){
		currLifetime -= Time.deltaTime;
//		Debug.Log(currLifetime);
		yield;
		t += Time.deltaTime;
		if(t>1.0){
			t=0;
		}
			
		Debug.Log(gameObject.renderer.material.color + ' ' + t);
		if(currLifetime>lifetime/2.0){
			transform.position.y += 3*direction*Time.deltaTime;
		}
		else if(currLifetime<lifetime/2.0){
			//Debug.Log(transform.position.y);
			if(direction < 0)
				transform.position.y += 6*direction*Time.deltaTime;
		}
		//Debug.Log(currLifetime);
	}
	//Destroy(this.gameObject);
}