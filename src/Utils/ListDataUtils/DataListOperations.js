export const getSumOfDataListProp = (dataObj, key) => {
    try {
        const totalSum = dataObj.reduce((acc, data) => {
            return data[key] + acc
        }, 0).toFixed(3)

        return isNaN(totalSum) ? '' : Number(totalSum)
    } catch {
        return 0
    }


}

export const calculatePercentage = (tcurr_value, tone_day_prev_net_val) => {
    if (tone_day_prev_net_val === 0) {
      return "N/A"; // Avoid division by zero
    }
    return ((tcurr_value - tone_day_prev_net_val) / tone_day_prev_net_val * 100).toFixed(2);
  };