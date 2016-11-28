<snippet>
  <content>
# ChrisWFanpageCrawler

## Usage
Crawl Facebook fanpage messages

## How to Use
1. Open console on Chrome (`option+command+i` on mac).
2. Paste all the code to console.
3. Edit `fanPageName` to your fanpage name.
4. Run `clickIteration(conversationStartingPoint, conversationEndingPoint, conversationCellClickedAwaitedTimeInSecond)`
5. Clear console and `console.log(JSON.stringify(conversationJSON))` and save. (You can right click console and save all content.)

## Example

* If you want to crawl conversationID 1 to 99, and each coversation spend 1 second to crawl:<br>
Run `clickIteration(1, 99, 1)`

* If you want to crawl conversationID 10 to 50, and each coversation spend 2.5 second to crawl:<br>
Run`clickIteration(10, 50, 2.5)`

## Note
* The larger conversationID (let's say...400 or 1000), the longer it takes to crawl a single conversation. So we need to set `clickIteration `'s third parameter to larger number. For example, 3.5 or 4 seconds.
*  Sometimes it will get an empty `conversationJSON`. Reload page, try again.
*  My mac will overheat if I crawl too many conversation at a time, so I suggest 50 to 100 at a time.

## Structure
1. `clickIteration()`: Recursively click each conversationCell on the left.
2. `scrollToTop()`: On the rightside, conversationBlock, scroll 3 times to load messages (if there are anything to scroll). You can set this in `conversationBlockScrollRepeat` variable.
3. `messageCrawled()`: Crawl messages.
	* get messagePakage, 
	* get messageContent, messageSender
	* `if messageContent is ''`, `findImageURLFromUser()` or `findImageURLFromFanpage()` to get image url .

## Screenshot

![Imgur](http://i.imgur.com/zhYOYwT.png)
![Imgur](http://i.imgur.com/Ry1lMlj.png)
![Imgur](http://i.imgur.com/SwhrNps.png)

## Output JSON

In conversationJSON: 
	{threadID:ConversationArray}
![Imgur](http://i.imgur.com/XV9kI3I.png )
In ConversationArray: 
	{messages}
![Imgur](http://i.imgur.com/7UDOEoB.png =100x20)
<br>
In messages:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageSender<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageContent<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageType(text, image, thumbsup)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timeSent


## Environment
* Operating System: OS X El Capitan v10.11.4
* Browser: Chrome 54.0.2840.98 (64-bit)


