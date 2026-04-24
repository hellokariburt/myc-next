const changeTime = (x: string) => {
  const timeCheck = x.substr(11, 5).split(':');
  const hours = Number(timeCheck[0]);
  const minutes = Number(timeCheck[1]);

  let timeValue: string;

  if (hours > 0 && hours <= 12) {
    timeValue = `${hours}`;
  } else if (hours > 12) {
    timeValue = `${hours - 12}`;
  } else {
    timeValue = '12';
  }

  timeValue += minutes < 10 ? `:0${minutes}` : `:${minutes}`;
  timeValue += hours >= 12 ? 'pm' : 'am';

  return timeValue;
};

export default changeTime;
