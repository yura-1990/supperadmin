import styled from "styled-components";
import { pxToRem } from "../../../../../utils";

export const StyledUsers = styled.div`
  .page_header {
    padding: ${pxToRem(10)} ${pxToRem(4)};
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn_group {
      display: flex;
      align-items: center;
      button {
        margin: 0 ${pxToRem(5)};
      }
      .fill_search{
        margin: 0 ${pxToRem(5)};
      }
      #excel {
        display: none;
      }
    }
  }
`;
