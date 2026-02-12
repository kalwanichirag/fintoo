
  const renderTypes = (n) => {
    validator.addMethod(
      "ifsc",
      function (value, element) {
        var reg = /^[A-Za-z]{4}[0-9]{6,7}$/;
        if (this.optional(element)) {
          
          
          return true;
        }
        if (value.match(reg)) {
          return true;
        } else {
          return false;
        }
      },
      "Please specify a valid IFSC CODE"
    );
  };
