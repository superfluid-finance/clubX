const getDefaultSponsorAmount = (sponsorLvl: number | undefined = 1): number => {
  if (sponsorLvl == 1) {
    return 0.1;
  } else if (sponsorLvl == 2) {
    return 0.05;
  } else if (sponsorLvl == 3) {
    return 0.02;
  } else if (sponsorLvl == 4) {
    return 0.01;
  } else if (sponsorLvl == 5) {
    return 0.005;
  } else {
    return 0.001;
  }
};

export default getDefaultSponsorAmount;