import React from 'react';
import { Image } from 'react-bootstrap';
import iron from '../../assets/rank_badges/iron.webp';
import bronze from '../../assets/rank_badges/bronze.webp';
import silver from '../../assets/rank_badges/silver.webp';
import gold from '../../assets/rank_badges/gold.png';
import platinum from '../../assets/rank_badges/platinum.webp';
import diamond from '../../assets/rank_badges/diamond.webp';
import ascendant from '../../assets/rank_badges/ascendant.png';
import immortal from '../../assets/rank_badges/immortal.webp';
import radiant from '../../assets/rank_badges/radiant.webp';
import unranked from '../../assets/rank_badges/unranked.webp';

const RankBadge = (props) => {
  const { rank, width = '30px' } = props;

  const Badge = () => {
    switch (Number(rank)) {
      case 0:
        return unranked;
      case 1:
        return iron;
      case 2:
        return bronze;
      case 3:
        return silver;
      case 4:
        return gold;
      case 5:
        return platinum;
      case 6:
        return diamond;
      case 7:
        return ascendant;
      case 8:
        return immortal;
      case 9:
        return radiant;
      default:
        return unranked;
    }
  };

  return (
    <>
      <Image src={Badge()} width={width} />
    </>
  );
};

export default RankBadge;
