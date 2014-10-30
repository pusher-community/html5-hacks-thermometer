function getNumericVal(el, selector) {
  var el = el.find(selector);
  var val = el.text();
  val = parseInt(val.replace(/\D/g, ''), 10); // remove £ and commas + parse
  return val;
}

function setUp(thermometerSelector) {
  var config = {};
  config.el = $(thermometerSelector);
  config.middleEl = config.el.find('.display .middle');
  config.middleValueEl = config.middleEl.find('.value');
  config.currentTotalEl = config.el.find('.current_total .value');    
  config.numberOfMarks = parseInt(config.middleEl.height()/10, 10);
  config.goalValue = getNumericVal(config.el, '.figures .goal .value');
  config.currentTotalValue = getNumericVal(config.el, '.figures .current_total .value'); 
  config.pixelsPerValue = config.middleValueEl.height()/config.currentTotalValue;
  config.valuePerMark = config.goalValue/config.numberOfMarks;

  return config;
}

function addThermometerMarks(middleEl, numberOfMarks, valuePerMark) {
  for(var i = 1; i <= numberOfMarks; ++i) {
    var amount = parseInt(valuePerMark * i);
    var markEl = $('<div class="mark"></div>');
    markEl.css({'position': 'absolute', 'bottom': (i*10) + "px"});
    markEl.attr('title', '£' + amount);
    var tooltip = $('<div class="tooltip">&pound;' + amount + '</div>');
    markEl.append(tooltip);
    middleEl.append(markEl);
  }
}

function addMarkHighlights(middleEl) {
  middleEl.find('.mark').hover(function() {
    var el = $(this);
    el.addClass('mark-selected');
  },
  function() {
    var el = $(this);
    el.removeClass('mark-selected');        
  });
}

function addCommas(number) {
  var number = number+''; var l = number.length; var out = '';
  var n = 0;
  for (var i=(l-1);i>=0;i--) {
  	out = '<span class="l">'+number.charAt(i)+'</span>'+out;
  	if ((l-i)%3 == 0 && i != 0) {
  		out = '<span class="lcom">,</span>'+out;
  	}
  	n++;
  }
  return out;
}

function animateText(el, fromValue, toValue) {
  var total = fromValue;
  var interval = setInterval(function() {
    if(total < toValue) {
      // 2000ms for the animation, we update every 50ms
      total += parseInt((toValue-fromValue) / (2000/50));
      total = Math.min(total, toValue);
      el.html('&pound;' + addCommas(total));
    }
    else {
      clearInterval(interval);
    }
  }, 50);
  return interval;
};

function animateThermometer(valueEl, fromHeight, toHeight, totalEl, totalValue, callback) {
  // animate down really quickly. If a users sees it then it won't look too bad.
  valueEl.animate({'height': fromHeight + 'px'}, 'fast', function() {
    // animate back up slowly. Cool!
    valueEl.animate({'height': toHeight}, '2000', function() {
      totalEl.html('&pound;' + addCommas(totalValue));
      callback();
    });
  });
}

function animateValues(valueEl, totalEl, fromValue, toValue, goalValue, pixelsPerValue) {
  var fromHeight = pixelsPerValue*fromValue;
  var toHeight = Math.min(pixelsPerValue*toValue, pixelsPerValue*goalValue);
  var interval = animateText(totalEl, fromValue, toValue);
  animateThermometer(valueEl, fromHeight, toHeight, totalEl, toValue,
    function() {
      clearInterval(interval);
    });
  return interval;
}

function addBehaviours(config, setInitialValues) {
  setInitialValues = (setInitialValues === undefined? true: setInitialValues);
  addThermometerMarks(config.middleEl, config.numberOfMarks, config.valuePerMark);
  addMarkHighlights(config.middleEl);
  if(setInitialValues) {
    animateValues(config.middleValueEl, config.currentTotalEl, 0,
                  config.currentTotalValue, config.goalValue, config.pixelsPerValue);
  }
}

function animateDonation(middleValueEl, currentTotalEl, currentTotal, newTotal,
                                         pixelsPerValue, goalValue) {
  var newHeightPixels = parseInt(pixelsPerValue * newTotal, 10);
  return animateValues(middleValueEl, currentTotalEl, currentTotal, newTotal,
                       goalValue, pixelsPerValue);
};

$(function() {
  var config = setUp('.thermometer-widget');
  addBehaviours(config, true);
  
  var pusher = new Pusher("8d7867b9c36e71e38fd1");
  var channel = pusher.subscribe('donations-channel');
  var animateInterval = null;
  channel.bind('new_donation', function(data) {
    if(animateInterval) {
      clearInterval(animateInterval);
    }
    var newTotal = data.newTotal;
    var currentTotalValue = getNumericVal(config.el, '.figures .current_total .value');
    animateInterval = animateDonation(config.middleValueEl, config.currentTotalEl, currentTotalValue, newTotal, config.pixelsPerValue, config.goalValue);
  });
});  