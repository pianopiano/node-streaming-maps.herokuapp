socket = io.connect 'http://192.168.0.3:3000/'
mapObj = null
num = -1
latlng = null
marker = 0
icon = null
markers = []
infowindow = null
$win = $(window)
iconSize = new google.maps.Size(32,32)
socket.on 'stream', (data) ->
	if data.geo
		num++
		$('#tweets').text num+1
		url = data.user.profile_image_url_https
		name = data.user.screen_name
		id = data.id_str
		txt = data.text
		icon = new google.maps.MarkerImage(url)
		icon.size = iconSize
		latlng = new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1])
		marker = new google.maps.Marker
			position: latlng
			map: mapObj
			icon: icon
			title:data.user.screen_name
			animation: google.maps.Animation.DROP
			
		marker.set "latlng", latlng
		marker.set "id", num
		marker.set "url", "https://twitter.com/"+name+"/status/"+id
		marker.set "constents", '<img src="'+url+'" width="42" height="42" /><a> '+name+'</a><br />'+txt
		markers.push marker
		google.maps.event.addListener marker, 'mouseover', (e) ->
			infowindow = new google.maps.InfoWindow
				content: this.get("constents")
			infowindow.setPosition this.get("latlng")
			infowindow.open mapObj, markers[this.get("id")]
			
		google.maps.event.addListener marker, 'mouseout', (e) ->
			infowindow.close()
			
		google.maps.event.addListener marker, 'click', (e) ->
			window.open this.get("url")
			
initialize = ->
	latlng = new google.maps.LatLng 20, 160
	opts = {
		zoom: 2,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	mapObj = new google.maps.Map(document.getElementById("map_canvas"), opts)

resizeHandler = ->
	$('#map_canvas').css
		'width':$win.width()+'px','height':$win.height()+'px'
	$('header').css
		'left':$win.width()/2-250+'px'

$ ->
	initialize()
	$win.resize resizeHandler
	resizeHandler()
