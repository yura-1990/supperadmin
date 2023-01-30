import styled from "styled-components";
import { pxToRem } from "../../../../../utils";

export const StyledRegPage = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  .page_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${pxToRem(10)} 0;
    .btn_group {
      .search_Inp {
        margin-right: ${pxToRem(6)};
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .ant-input-number {
    width: 100%;
  }
  .page_img {
    width: ${pxToRem(60)};
    height: ${pxToRem(60)};
    object-fit: cover;
  }
`;
