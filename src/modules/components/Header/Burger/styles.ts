import styled from 'styled-components';

interface BurgerProps {
  open: boolean
}

export const StyledBurger = styled.div`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 25px;
  right: 20px;
  z-index: 21;
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background-color: ${({ open }: BurgerProps) => open ? '#FFFFFF' : '#FFFFFF'};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ open }: BurgerProps) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      transform: ${({ open }: BurgerProps) => open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ open }: BurgerProps) => open ? 0 : 1};
    }

    &:nth-child(3) {
      transform: ${({ open }: BurgerProps) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;