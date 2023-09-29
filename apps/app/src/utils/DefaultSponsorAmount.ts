const getDefaultSponsorAmount = (sponsorLvl: number | undefined = 1) => {
  switch (sponsorLvl) {
    case 1:
      return 1000000000000000000n;
    case 2:
      return 460000000000000000n;
    case 3:
      return 190000000000000000n;
    default:
      return 0n;
  }
};

export default getDefaultSponsorAmount;
