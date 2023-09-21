const getDefaultSponsorAmount = (sponsorLvl: number | undefined = 1) => {
  if (sponsorLvl == 1) {
    return 100000000000000000n;
  } else if (sponsorLvl == 2) {
    return 50000000000000000n;
  } else if (sponsorLvl == 3) {
    return 20000000000000000n;
  } else if (sponsorLvl == 4) {
    return 10000000000000000n;
  } else if (sponsorLvl == 5) {
    return 5000000000000000n;
  } else {
    return 1000000000000000n;
  }
};

export default getDefaultSponsorAmount;
