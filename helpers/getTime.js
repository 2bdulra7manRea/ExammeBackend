function GetTime() {
  let TimeJoining = new Date();
  let Timing = TimeJoining.getHours() + ":" + TimeJoining.getMinutes();

  return Timing;
}

module.exports = GetTime;
