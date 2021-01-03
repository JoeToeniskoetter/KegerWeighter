import React from 'react'

export function useModal(){
  const [open, setOpen] = React.useState<boolean>(false);
    return {
      open,
      setOpen
    };
}