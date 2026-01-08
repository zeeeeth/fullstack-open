import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { Gender } from '../../types';

interface BasicInfoProps {
  name: string;
  gender: Gender;
  ssn: string;
  occupation: string;
  dateOfBirth: string;
}

const BasicInfo = ({
  name,
  gender,
  ssn,
  occupation,
  dateOfBirth,
}: BasicInfoProps) => {
  return (
    <div>
      <h2>
        {name} {gender === 'female' && <FemaleIcon />}
        {gender === 'male' && <MaleIcon />}
      </h2>
      <div>ssn: {ssn}</div>
      <div>occupation: {occupation}</div>
      <div>date of birth: {dateOfBirth}</div>
    </div>
  );
};

export default BasicInfo;
