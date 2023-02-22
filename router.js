ymaps.ready(init);

    function init() {
        var days = [
            'sun',
            'mon',
            'tu',
            'wen',
            'th',
            'fr',
            'sat'
          ];
          var d = new Date();
          var nn = d.getDay();
          let t = d.getHours();

          var traffic=0;

        switch (days[nn]) {
            case 'sat':
            case 'sun':
                traffic +=0; 
                // alert( 'Маловато' );
                break;
            case 'fr':
            case 'th':
            case 'mon':
            case 'tu':
            case 'wen':
                traffic +=3;
                break;
        }
        
        
        switch (t){
            case 23:
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                traffic = 0;
                break;
            
            case 6:
                traffic +=1;
                break;
            case 8:
            case 11:
            case 12:
            case 13:
            case 15:
            case 14:
            case 22:
            case 20:
                traffic+=3;
                break;
            case 9:
            case 10: 
            
            case 19:
                traffic+=4;
                break;
            case 16:
            
                traffic+=5;
                break;
            case 17:
            case 18:
                traffic+=6;
                break;
            case 21:
            case 7:
                traffic+=2;
                break;
           
      

        }
        console.log(traffic)
        let n=1;
        switch (traffic){
            case 0:
                n=n*0.81;
                break;
            case 1:
                n=n*0.86;
                break;
            case 2:
                n=n*0.91;
                break;
            case 3:
                n=n*0.96;
                break;
            case 4:
                n=n*1.01;
                break;
            case 5:
                n=n*1.11;
                break;
            case 6:
                n=n*1.19;
                break;
            case 7:
                n=n*1.24;
                break;
            case 8:
                n=n*1.28;
                break;
            case 9:
                n=n*1.33;
                break;
            case 10:
                n=n*1.39;
                break;


        }
        let inputCity = document.querySelector('.input_city'); 
        let inputA = document.querySelector('.input_inA'); 
        let inputB = document.querySelector('.input_inB');
        let button = document.querySelector('button');
        let inRashod = document.querySelector('.input_rashod')
        let select1 = document.getElementById('cities');

        
        let pointA
        let pointB
        let pointCity
        let bb
        let rashod

        
        var myMap = new ymaps.Map("map", {
            center: [56.3081666, 44.0238771],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        });
        
        button.onclick = function (){
            delete moveList; 
            let apiKey = "bd550011bdc3b1e12ec74f06ca1b0d68";
            // Город погода которого нужна
            let city = inputCity.value;
            // Формируем url для GET запроса
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${apiKey}`;

            myMap.geoObjects.removeAll()

            axios.get(url).then(res => {
                // Выводим результат в консоль браузера
                console.log(res.data);
                })
                // Отправка GET запроса
                axios.get(url).then(res => {
                // Вывод города
                document.querySelector('.city').innerHTML = res.data.name
                // Вывод температуры
                document.querySelector('.temp').innerHTML = res.data.main.temp
                // console.log(document.querySelector('.temp').innerHTML)
                const temp= document.querySelector('.temp').innerHTML
                // console.log(snow);
                // Вывод влажности
                document.querySelector('.humidity').innerHTML = res.data.main.humidity
                // Вывод скорости ветра
                document.querySelector('.wind').innerHTML = res.data.snow;
                // return temp
                var snow = document.querySelector('.wind').innerHTML
                const re = snow.split(" ", 2);




            let weather = 1;  
            if((temp <0  )&&(temp>=-5)){
                weather=weather*1.08;
            }
            if((temp <-5  )&&(temp>=-10)){
                weather=weather*1.13;
            }
            if((temp <-10  )&&(temp>=-15)){
                weather=weather*1.15;
            }
            if((temp <-15 )&&(temp>=-20)){
                weather=weather*1.17;
            }
            if((temp <-20  )&&(temp>=-25)){
                weather=weather*1.19;
            }
            if((temp <-25  )){
                weather=weather*1.23;
            }

            pointA = inputCity.value +" "+ inputA.value;
            pointB = inputCity.value +" "+ inputB.value;
            point1 = select1.value;

            rashod = inRashod.value;
            
            rashod = rashod*n;
            
            inputA.value = inputA.value;
            inputB.value = inputB.value;
            inputCity.value = inputCity.value;
            inRashod.value = inRashod.value;


            var tt=pointA;
            var tt1=pointB;
            

            ymaps.geocode(tt,{results:1}).then(
            function(res){  var MyGeoObj = res.geoObjects.get(0);

            //извлечение координат
            var ttt = MyGeoObj.geometry.getCoordinates();
            //добавляем метку на карте
            ymaps.geocode(tt1,{results:1}).then(
                function(res){  
                  var MyGeoObj = res.geoObjects.get(0)
                //извлечение координат
                var ttt1 = MyGeoObj.geometry.getCoordinates();
            var new_center = [(ttt[0]+ttt1[0])/2, (ttt[1]+ttt1[1])/2]
            // console.log(new_center);

            myMap.setCenter(new_center);
        }
        );
    }
    );

    ymaps.route([
        pointA,
        pointB
       
       

    ]).then(function (route) {

        // myMap.setCenter(ttt);
        myMap.geoObjects.add(route);

        var points = route.getWayPoints(),
            lastPoint = points.getLength() - 1;

        points.options.set('preset', 'islands#redStretchyIcon');
        // Задаем контент меток в начальной и конечной точках.
        points.get(0).properties.set('iconContent', 'Точка отправления');
        points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');
        

        var moveList = 'Длина маршрута ',
            way,
            segments;

        var length = 0
        for (var i = 0; i < route.getPaths().getLength(); i++) {
            way = route.getPaths().get(i);
            segments = way.getSegments();
            for (var j = 0; j < segments.length; j++) {
                var street = segments[j].getStreet();
                length += segments[j].getLength();

            }
        }

            var oil=52.5;
                switch (point1){
                    case 'b100':
                        var oil =60.5;
                        break;
                    case 'b95':
                        var oil =53;
                        break;
                    case 'b92':
                        var oil =48.4;
                        break; 
                    case 'dt':
                        var oil =53;
                        break;
                        
                }

        if((length<=2)&&(length>0)){
            rashod=rashod*1.2;
        }else if((length<=5)&&(length>2)){
            rashod=rashod*1.1;
        }else
        if((length<=10)&&(length>5)){
            rashod=rashod*0.999;
        }else
        if((length<=20)&&(length>10)){
            rashod=rashod*0.91;
        }else
        if((length<=50)&&(length>20)){
            rashod=rashod*0.86;
        }else
        if((length<=100)&&(length>50)){
            rashod=rashod*0.83;
        }else
        if((length>100)){
            rashod=rashod*0.78;
        }

        var len = Math.round(length/1000*oil*rashod/100*weather);

                const list = document.querySelector('#list'); 
                    list.innerHTML = ''; 
                    moveList = ` 
                    ${Math.round(length) / 1000} км 
                    Стоимость поездки ${len}₽ ` ; 
                    list.append(moveList);
                    
                    list.append("Температура в городе "+ city +" "+temp +"С°");
        alter(data);
    })
    }, function (error) {
        alert('Возникла ошибка: ' + error.message);
    });
}
}
