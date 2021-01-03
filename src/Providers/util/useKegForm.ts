import {useState} from 'react';
import {Keg} from '../../KegStack/MyKegs';

interface useKegFormProps {
  keg: Keg | null;
}

const defaultKegForm = {
  beerType: '',
  customTare: 0,
  data: {
    id: '',
    beersDrank: 0,
    temp: 0,
    beersLeft: 0,
    date: new Date(),
    percLeft: 0,
    kegId: '',
    kegSize: '',
    weight: 0,
  },
  id: '',
  kegSize: '',
  location: '',
  userId: '',
  subscribed: false,
  notifications: {
    id: '',
    kegId: '',
    firstPerc: 0,
    secondPerc: 0,
    firstNotifComplete: false,
    secondNotifComplete: false,
    date: new Date(),
  },
};

export function useKegForm({keg}: useKegFormProps) {
  const [kegForm, setKegForm] = useState<Keg>(defaultKegForm);

  if (keg) {
    setKegForm(keg);
  }

  function handleChange(name: string, value: any) {
    setKegForm({...kegForm, [name]: value});
  }

  return {
    kegForm,
    handleChange,
  };
}
