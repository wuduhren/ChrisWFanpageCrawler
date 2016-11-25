var fanPageName = '知識王'
var conversationBlockScrollRepeat = 3
var conversationID = 1
var conversationJSON = {}

//-------------------------------------------Main------------------------------------------

function clickIteration(conversationStartingPoint, conversationEndingPoint, conversationCellClickedAwaitedTimeInSecond) {
	if (conversationID > conversationEndingPoint) { return } //Safty - conversationID ending point

	if (!conversationCell(conversationID)){
		var scrollable = document.querySelector('#u_0_b > div > div > div > div._10ua > table > tbody > tr > td._10uf._1-9p._51m-.vTop > div > div > div:nth-child(1) > div._5nbb.uiScrollableArea.fade > div.uiScrollableAreaWrap.scrollable')
		scrollable.scrollTop = scrollable.scrollHeight

		setTimeout(function() {
			clickIteration(conversationStartingPoint, conversationEndingPoint, conversationCellClickedAwaitedTimeInSecond)
		}, 3000)

	} else {

		if (conversationID < conversationStartingPoint) {
			conversationID++
			clickIteration(conversationStartingPoint, conversationEndingPoint, conversationCellClickedAwaitedTimeInSecond)
			return
		}
		console.log("conversationID: " + conversationID)
		conversationCell(conversationID).scrollIntoView()
		conversationCell(conversationID).click()
		setTimeout(function() {
			scrollToTop(function(){
				var threadID = getHTMLData()['threadid']
				console.log('threadid: ' + threadID)
				conversationJSON[threadID] = conversationCrawled()
				conversationID++
				clickIteration(conversationStartingPoint, conversationEndingPoint, conversationCellClickedAwaitedTimeInSecond)
			})
		}, conversationCellClickedAwaitedTimeInSecond * 1000)
	}
}

function conversationCrawled(){
	var i = 0
	var conversation = []
	
	while (nextMessageExist(i)) {
		conversation.push(messageCrawled(i))
		i++
	}
	// console.log(JSON.stringify(conversation))
	return conversation
}


function messageCrawled(i){
	console.log('i: ' + i)
	
	var message = {}
	var messagePakage = document.querySelectorAll('#js_1 > div > div.clearfix')[i]
	var messageContent = getMessageContent(messagePakage)
	var messageSender = messagePakage.querySelector('div._41ud > h5').innerText //senderName
	var timeSent
	var messageType = 'text'

	if (messageSender == fanPageName){
		timeSent = getAttribute(messagePakage.querySelector('div._41ud > div.clearfix > div._3058'), 'data-tooltip-content')
		messageSender = getHTMLData()['business_id']

		if (messageContent == '') {
			messageContent = findImageURLFromFanpage(messagePakage)
			timeSent = getAttribute(messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div'), 'data-tooltip-content')

			if (messageContent == '(y)') { 
				messageType = 'thumbsup' 
			} else {
				messageType = 'image'
			}
		}
	} else {
		//User
		timeSent = getAttribute(messagePakage.querySelector('div._1t_q > div._4ldz'), 'data-tooltip-content')
		timeSent = timeSent.replace(messageSender, "")
		messageSender = getUserFBID()

		if (messageContent == '') {
			messageContent = findImageURLFromUser(messagePakage)
			if (messageContent == '(y)') { 
				messageType = 'thumbsup' 
			} else {
				messageType = 'image'
			}
		}
	}

	message['messageSender'] = checkIfNull(messageSender, 'messageSender')
	message['messageContent'] = checkIfNull(messageContent, 'messageContent')
	message['messageType'] = checkIfNull(messageType, 'messageType')
	message['timeSent'] = isoTime(checkIfNull(timeSent, 'timeSent'))

	return message
}


//-------------------------------------------Utilities------------------------------------------

function scrollToTop(callback){
	// console.log(conversationBlockScrollRepeat)
	if (conversationBlockScrollRepeat < 1) {
		callback()
		return 
	}

	if (document.querySelector('#u_0_b > div > div > div > div._10ua > table > tbody > tr > td._10ug._51mw._51m-.vTop > div > div > table > tbody > tr > td._2utc._51m-.vTop > div._11y7.uiScrollableArea.nofade.contentBefore > div.uiScrollableAreaWrap.scrollable') == null){ 
		callback()
		return 
	}

	var conversationScrollable = document.querySelector('#u_0_b > div > div > div > div._10ua > table > tbody > tr > td._10ug._51mw._51m-.vTop > div > div > table > tbody > tr > td._2utc._51m-.vTop > div._11y7.uiScrollableArea.nofade.contentBefore > div.uiScrollableAreaWrap.scrollable')
	conversationScrollable.scrollTop = -conversationScrollable.scrollHeight
	conversationBlockScrollRepeat--
	setTimeout(function() {
		scrollToTop(callback)
	}, 1000)
}

function nextMessageExist(i){
	if (typeof document.querySelectorAll('#js_1 > div > div.clearfix')[i] === typeof undefined){
		return false
	} else {
		return true
	}
}

function conversationCell(conversationID){
	var selector = "#u_0_b > div > div > div > div._10ua > table > tbody > tr > td._10uf._1-9p._51m-.vTop > div > div > div:nth-child(1) > div._5nbb.uiScrollableArea.fade.contentAfter > div.uiScrollableAreaWrap.scrollable > div > div > ul > li:nth-child(" + conversationID + ")"
	if (document.querySelector(selector)){
		return document.querySelector(selector)
	} else {
		return false
	}
}

function getMessageContent(messagePakage){
	if (messagePakage.querySelectorAll('div._41ud > div.clearfix')[0].innerText == ''){ return ''}

	var messageContentArray = []
	var i = 0
	while(typeof messagePakage.querySelectorAll('div._41ud > div.clearfix')[i] !== typeof undefined){
		messageContentArray.push(messagePakage.querySelectorAll('div._41ud > div.clearfix')[i].innerText)
		i++
	}
	return messageContentArray
}

function findImageURLFromFanpage(messagePakage){

	if (messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div > div > div._1i1j') != null) {
		return '(y)' 
	}

	if (messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div > div._2poz') != null){
		var baseURL = 'www.facebook.com'
		var styleString = getAttribute(messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div > div._2poz'), 'style')
		var url = styleString.substring(styleString.indexOf("url(") + 5, styleString.indexOf(");"))
		return baseURL + url
	} else {
		return 'error - findImageURLFromFanpage failed'
	}
}

function findImageURLFromUser(messagePakage){

	if (messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div > div._1i1j') != null) { 
		return '(y)' 
	}

	if (messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div._2poz') != null){
		var baseURL = 'www.facebook.com'
		var styleString = getAttribute(messagePakage.querySelector('div._41ud > div.clearfix > div._3058 > div._2poz'), 'style')
		var url = styleString.substring(styleString.indexOf("url(") + 5, styleString.indexOf(");"))
		return baseURL + url
	} else {
		return 'error - findImageURLFromUser failed'
	}
}

function getHTMLData(){
	var url = location.search
	var key, value
	var data = {}

	if (url.indexOf("?") != -1) {
	    var getSearch = url.split("?")
	    key = getSearch[1].split("&")
	    for (i = 0; i < key.length; i++) {
	    	value = key[i].split("=")
	    	// aryPara.push(ParaVal[0]);
	    	data[value[0]] = value[1]
	    }
	}
	return data
}

function getUserFBID(){

	var selector = "#u_0_b > div > div > div > div._10ua > table > tbody > tr > td._51mw._51m-.vTop > div > div > table > tbody > tr > td._2utc._51m-.vTop > div._3stw.clearfix > div._ohe.lfloat > div > div > a"
	var url = document.querySelector(selector).href
	var key, value
	var data = {}

	if (url.indexOf("?") != -1) {
	    var getSearch = url.split("?")
	    key = getSearch[1].split("&")
	    for (i = 0; i < key.length; i++) {
	    	value = key[i].split("=")
	    	// aryPara.push(ParaVal[0]);
	    	data[value[0]] = value[1]
	    }
	}
	
	if (data['id']){
		return data['id']
	} else {
		return 0 //ERROR
	}
}

function isoTime(timeSent){
	timeSent = timeSent.replace("年", "-")
	timeSent = timeSent.replace("月", "-")
	timeSent = timeSent.replace("日", "T")
	timeSent = timeSent.replace(" ", "")
	timeSent = timeSent + ':00Z'
	return timeSent
}

function checkIfNull(object, name){
	if (object == null){
		return 'error - could not get' + name
	}
	return object
}

function getAttribute(element, attribute){
	if (element == null){
		return 'error - counld not get element'
	}
	if (element.hasAttribute(attribute)){
		return element.getAttribute(attribute)
	} else {
		return 'error - counld not get element'
	}
}

//---------------------------------------------------------------------------------------------

// clickIteration()
console.log(JSON.stringify(conversationJSON))