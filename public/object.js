function ChatBubble(message_data)
{
	this.x = 15;
	this.y;
	this.data = message_data;
	this.width = 470;
	this.height;
	this.colour;

	this.draw = function(y)
	{
		this.y = y

		let message = this.format_text(this.data.message);
		message.push(name);
		let first = font.textBounds(message[0], this.x + 7, this.y + 18);
		let last = font.textBounds(message[message.length-1], this.x + 7, this.y + 17*(message.length-1));
		this.height = last.y+last.h-first.y + 30;

		stroke(0);
		strokeWeight(1);
		if(this.data.id == socket.id)
		{
			this.colour = color(0, 82, 42);
		}
		else
		{
			this.colour = color(80);
		}
		fill(this.colour);
		rect(this.x, this.y, this.width, this.height, 6);

		fill(255);
		textFont('Arial');
		textSize(15);
		// strokeWeight(0.5);
		noStroke();
		for(let i = 0; i < message.length; i++)
		{
			if (i == message.length-1)
			{
				fill(160);
			}
			text(message[i], this.x + 7, this.y + 18 + i*17);
		}
	}

	this.format_text = function(text)
	{
		let _text = text;
		let str_list = [];
		let str = "";

		let counter = 0;

		while(counter < _text.length)
		{
			if(textWidth(_text.slice(0, counter)) >= 380 && _text[counter] == " ")
			{
				str_list.push(_text.slice(0, counter));
				_text = _text.slice(counter, _text.length).trim();
				counter = 0;
			}

			counter++;
		}

		if(_text.length > 0)
		{
			str_list.push(_text.trim());
		}

		let h = 0;
		for(let i = 0; i < str_list.length; i++)
		{
			h += font.textBounds(str_list[i]).h + 4;
		}

		return str_list;
	}
}