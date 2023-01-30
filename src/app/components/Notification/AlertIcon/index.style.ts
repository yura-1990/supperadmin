import styled from "styled-components";
import { pxToRem } from "../../../../utils";

export const StyledAlertIcon = styled.div`
  position: relative;
  .count {
    position: absolute;
    top: -${pxToRem(6)};
    left: ${pxToRem(15)};
    padding: ${pxToRem(2)};
    border-radius: ${pxToRem(6)};
    background: ${(p) => p.theme.pink};
    font-size: ${pxToRem(12)};
  }
  margin-right: ${pxToRem(8)};
`;
