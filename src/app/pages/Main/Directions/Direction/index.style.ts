import styled from "styled-components";
import { pxToRem } from "../../../../../utils";

export const StyledDirections = styled.div`
  .page_header {
    padding: ${pxToRem(10)} ${pxToRem(4)};
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn_group{
      .search_Inp{
        margin-right: ${pxToRem(6)};
      }
    }
  }
`;
