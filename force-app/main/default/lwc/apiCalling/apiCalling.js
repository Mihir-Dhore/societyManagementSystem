import { LightningElement,track } from 'lwc';

export default class ApiCalling extends LightningElement {
        //API Fetch Data
        @track result;

        @track searchValue;
        handleSearchChange(event){
            this.searchValue = event.target.value;
         }
    
        handleFetch() {
          console.log('enter into button');
          let endPoint = `https://api.weatherapi.com/v1/current.json?key=6388b321ff7a4f239de125943230612&q=${this.searchValue}`;
          console.log('endpoint',endPoint)
          fetch(endPoint, {
            method: "GET"
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('data',data)
            this.result = data;
           })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
        }
        
    
    
        //For agriculture API
        @track agriData;
        handleAgriClick(){
            let endPoint = "https://api.data.gov.in/catalog/6141ea17-a69d-4713-b600-0a43c8fd9a6c?api-key=579b464db66ec23bdd000001be46e8b8b04c4b746f8c908419d2c4e3&format=json&limit=1000&filters%5Bdistrict%5D=Pune";
            fetch(endPoint,{
                method: "GET"
            })
            .then((response)=> response.json())
            .then((data) => {
                console.log(data)
                this.agriData = data;
            }).catch(error=>{
                console.error('Error fetching data:', error);
            });
    
        }
    
        // To get current user location and weather details on click of button lwc
    
        handleCurrentLocation() {
        // Check if geolocation is supported by the browser
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const currentLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        console.log('Current Location:', currentLocation);
                        
                        let endPoint = `https://api.weatherapi.com/v1/current.json?key=6388b321ff7a4f239de125943230612&q=${currentLocation.latitude},${currentLocation.longitude}`;
                        console.log('Weather API endpoint:', endPoint);
    
                        fetch(endPoint, {
                            method: 'GET'
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log('Weather data:', data);
                                this.result = data;
                            })
                            .catch((error) => {
                                console.error('Error fetching weather data:', error);
                            });
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        }
    
     }