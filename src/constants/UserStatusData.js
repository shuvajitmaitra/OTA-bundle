import {useTheme} from '../context/ThemeContext';
import CrossCircle from '../assets/Icons/CrossCircle';
import ClockIcon from '../assets/Icons/ClockIcon';
import DoNotDisturbIcon from '../assets/Icons/DoNotDisturbIcon';
import BusyStatusIcon from '../assets/Icons/BusyStatusIcon';

const useUserStatusData = size => {
  const Colors = useTheme();

  return [
    {
      label: 'Online',
      value: 'online',
      icon: <BusyStatusIcon size={size || 20} color={Colors.Primary} />,
    },
    {
      label: 'Busy',
      value: 'busy',
      icon: <BusyStatusIcon size={size || 20} />,
    },
    {
      label: 'Do not disturb',
      value: "don'tDisturb",
      icon: <DoNotDisturbIcon size={size || 20} />,
    },
    {
      label: 'Be right back',
      value: 'rightBack',
      icon: <ClockIcon color={'orange'} size={size || 20} />,
    },
    {
      label: 'Appear away',
      value: 'away',
      icon: <ClockIcon size={size || 20} />,
    },
    {
      label: 'Appear offline',
      value: 'offline',
      icon: <CrossCircle size={size || 20} />,
    },
  ];
};

export default useUserStatusData;
