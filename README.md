angular-rangeslider
===================
_Current version: 0.0.2_

Angular RangeSlider is a directive that creates an interactive slider that allows a user to change model values.

It has been styled to match form elements styled by [Twitter's Bootstrap CSS framework](http://twitter.github.io/bootstrap/).

#### Requirements

- Angular (v1.1.4+)
- jQuery (v1.7+)

Quick example
-------------

A basic slider with a range of 0 to 100:

    <div range-slider min="0" max="100" model-min="min" model-max="max"></div>

As the handles are moved the model values `min` and `max` will be updated in the parent controller.

![Default example](screenshots/slider.png)

Options
-------

Options are set as attributes on the `<div range-slider>`

### `=` two-way bindings

`min` - the minimum value the user can select (must be a number, can be a model property)

`max` - the maximum value the user can select (must be a number, can be a model property)

`model-min` - the model property for the min value, represents the position of the min handle

`model-max` - the model property for the max value, represents the position of the max handle

`disabled` - model property or boolean, disables the slider when `true`

### `@` attributes

`orientation` - slider orientation, default: 'horizontal' - options: 'horizontal' | 'vertical' | 'vertical left' | 'vertical right'

`step` - amount to change the value by when moving a handle, default: 0

`decimal-places` - the number of decimal places to round to, default: 0

`filter` - a built-in filter to apply to the displayed values, for example `currency`

`filter-options` - options to pass to the filter

Some more examples
------------------

### Using model properties

The following properties are present in the scope:

    // set available range
    $scope.minPrice = 100;
    $scope.maxPrice = 999;
    
    // default the user's values to the available range
    $scope.userMinPrice = $scope.minPrice;
    $scope.userMaxPrice = $scope.maxPrice;
    
So we can include the directive in the HTML like this:

    <div range-slider min="minPrice" max="maxPrice" model-min="userMinPrice" model-max="userMaxPrice" step="5"></div>

As the user moves the min and max handles the `userMinPrice` and `userMaxPrice` will be updated in increments of `5` in real-time in the model.

### Using filters

Continuing from the example above we can format the values displayed to the user as currency.

    <div range-slider min="minPrice" max="maxPrice" model-min="userMinPrice" model-max="userMaxPrice" step="5" filter="currency"></div>

This will automatically be localised by Angular, but we can force it to be USD by passing this as an option:

    <div range-slider min="minPrice" max="maxPrice" model-min="userMinPrice" model-max="userMaxPrice" step="5" filter="currency" filter-options="USD$"></div>

![Currency example](screenshots/currency.png)

### Making the slider vertical

Simply add one of the following values to the `orientation` attribute: 'vertical', 'vertical left' or 'vertical right'.

This will create a vertical slider that is centred in it's parent element:

    <div range-slider min="0" max="100" model-min="min" model-max="max" orientation="vertical"></div>

![Vertical example](screenshots/vertical.png)

To left-align the slider use 'vertical left':

    <div range-slider min="0" max="100" model-min="min" model-max="max" orientation="vertical left"></div>
    
And to right-align the slider use 'vertical right':

    <div range-slider min="0" max="100" model-min="min" model-max="max" orientation="vertical right"></div>

### Disabling the slider

If you have a boolean property in your scope you can simply change this value to `true` to disable the slider:

    $scope.sliderDisabled = false;

And then specify the property using the disabled attribute:

    <div range-slider min="0" max="100" model-min="min" model-max="max" disabled="sliderDisabled"></div>
    
    // clicking this button will toggle the sliderDisabled value between true and false
    <button ng-click="sliderDisabled=!sliderDisabled">Toggle slider disabled status</button>
    
![Disabled example](screenshots/disabled.png)

To Do
-----

- Remove full jQuery dependency
- Make it work in older Angular versions
- Add option to move values with handles
- Improve behaviour when model values are not valid (e.g. min is greater than max)


Known Issues
------------

 - The slider restricts the model value when editing outside the slider (e.g. in an <input>) but the only notification is made to the `console`
 - The min slider handle disappears behind the max slider handle


Credits
-------

This was originally forked from [Léon Gersen's](http://refreshless.com/) brilliant noUiSlider:

https://github.com/leongersen/noUiSlider




