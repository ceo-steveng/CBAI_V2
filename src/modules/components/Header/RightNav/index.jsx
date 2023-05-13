import { useEffect } from 'react';
import { Link, Text } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

import { Ul } from './styles';
import { links } from '../../../../utils/links';
import { headerColors } from '../../../../utils/headerColors';

export function RightNav({ open, setOpen }) {
  useEffect(() => {
    if(open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  return (
    <Ul open={open}>
      { links.map(link => {
        return (
          <ScrollLink to={link} smooth={true} offset={-70} duration={1000} key={link}>
            <Text
              fontSize={'1rem'}
              color="white"
              p="0.5rem 1rem"
              mr={open ? '0' : '2.5rem'}
              _hover={{
                textDecoration: 'none',
                color: headerColors.hoverColor,
                cursor: 'pointer'
              }}
              onClick={() => setOpen(false)}
            >
              {link}
            </Text>
          </ScrollLink>
        );
      }) }
    </Ul>
  );
}
