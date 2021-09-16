export class Dialog {
	private _text: string;
	private _modal: any;
	private _lasttime: number;
	private _startTime: number;
	
	/**
	 * 
	 * @param text {string} text to display
	 * @param isModal {boolean} is dialog freezing rest of the scene
	 * @param time {number} how long text should be displayes
	 */
	constructor(text:string, isModal:boolean, shouldLast: number){
		this._text = text
		this._modal = isModal
		this._lasttime = shouldLast
		this._startTime = performance.now();
	}

	showModal() {

	}

	/**
	 * If function returns true it means that player is frozen and shouldn't be animated
	 */
	drawDialog(context: CanvasRenderingContext2D,w:number,h:number): boolean
	{
		const elapsedTime = performance.now() - this._startTime
		if(elapsedTime <= this._lasttime)
		{
			context.save()
			context.lineWidth = 1;
			context.fillStyle = "gray";
			context.font = "25px DotsFont";
			let textSize:TextMetrics = context.measureText(this._text)
			context.fillText(this._text, w / 2 - textSize.width/2, h / 2 - 25);
			context.strokeText(this._text, w / 2 - textSize.width/2, h / 2 - 25);
			context.restore()
		}
		return true;
	}

}