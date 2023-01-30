import styled from "styled-components";
import { pxToRem } from "../../../../utils";

export const StyledNotif = styled.div`
  .page_header {
    padding: ${pxToRem(10)} ${pxToRem(4)};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
