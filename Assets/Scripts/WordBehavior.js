#pragma strict
var lifetime : float = 4;
private var currLifetime : float;
var activated : boolean = false;
var correctWord : boolean;
var direction : int = 0;
var textController : TextController;
//var fader : Fade;

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
			Fade.use.Colors(gameObject.renderer.material, Color.white, Color.green, lifetime/6);
			direction = 1;
		}
		else {
			Fade.use.Colors(gameObject.renderer.material, Color.white, Color.red, lifetime/6);
			renderer.material.color = Color.red;
			direction = -1;
		}
			
	}
}

function Decay () {
	while(currLifetime>0){
		currLifetime -= Time.deltaTime;
		Debug.Log(currLifetime);
		if(currLifetime>lifetime/2){
			transform.position.y += direction*3*Time.deltaTime;
		}
		else if(currLifetime<(lifetime/2)){
			Fade.use.Alpha(gameObject.renderer.material, 1.0, 0.0, currLifetime);
			//Debug.Log(transform.position.y);
			if(direction < 0)
				transform.position.y += 6*direction*Time.deltaTime;
		}
		yield;
	}
	
	Destroy(this.gameObject);
}