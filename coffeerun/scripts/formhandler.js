(function(window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function FormHandler(selector) {
        if (!selector) {
            throw new Error('No selector provided');
        }

        this.$formElement = $(selector);
        if (this.$formElement.length === 0) {
            throw new Error('Could not find element with selector: ' + selector);
        }


    }

    FormHandler.prototype.addSubmitHandler = function(fn) {
        console.log('Setting submit handler for form');
        this.$formElement.on('submit', function(event) {
            event.preventDefault();

            var data = {};
            $(this).serializeArray().forEach(function(item) {
                data[item.name] = item.value;
                console.log(item.name + ' is ' + item.value);
            });



            console.log(data);
            fn(data);
            this.reset();
            this.elements[0].focus();
        });
    };

    FormHandler.prototype.addInputHandler = function(fn) {
        console.log('Setting input handler for form');
        this.$formElement.on('input', '[name="emailAddress"]', function(event) {

            var emailAddress = event.target.value;
            //console.log(fn(emailAddress));

            var message = '';
            if (fn(emailAddress)) {
                event.target.setCustomValidity('');
            } else {
                message = emailAddress + ' is not an authorized email address!';
                event.target.setCustomValidity(message);
            }
        });
    };

    //Listener for coffee order text field and for caffeine strength slider
    FormHandler.prototype.addDecafHandler = function(fn) {
        var coffee;
        console.log('Setting decaf handler for form');
        this.$formElement.on('input', '[name="coffee"]', function(event) {
            coffee = event.target;
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            var message;
            if (fn(data.coffee, data.strength)) {
                event.target.setCustomValidity('');
            } else {
                message = 'Caffeine level must be lower than 20 for Decaf coffee';
                event.target.setCustomValidity(message);
            }
        }.bind(this));


        this.$formElement.on('change', '[name="strength"]', function(event) {
            var data = {};
            this.$formElement.serializeArray().forEach(function(item) {
                if (item.name === 'coffee' || item.name === 'strength') {
                    data[item.name] = item.value;
                }
            });
            if (fn(data.coffee, data.strength)) {
                if (coffee) {
                    coffee.setCustomValidity('');
                }
                event.target.setCustomValidity('');
            } else {
                event.target.setCustomValidity('message');
            }
        }.bind(this));
    };


    App.FormHandler = FormHandler;
    window.App = App;
})(window);

var slider = document.getElementById('strengthLevel');
var sliderOutput = document.getElementById('strengthOutput');
var sliderLabel = document.getElementById('strengthLabel');

//sets initial value color (30) to green
sliderOutput.style.color = 'green';
sliderLabel.style.color = 'green';

//function for slider color
slider.addEventListener('input', function() {
    sliderOutput.value = slider.value;

    var color;
    if (slider.value < 21) {
        color = 'blue';
    } else if (slider.value < 41) {
        color = 'green';
    } else if (slider.value < 61) {
        color = '#aaaa00';
    } else if (slider.value < 81) {
        color = 'orange';
    } else {
        color = 'red';
    }
    sliderOutput.style.color = color;
    sliderLabel.style.color = color;
});
