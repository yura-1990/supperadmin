import styled from "styled-components";
import { Layout } from "antd";

const { Header } = Layout;

export const StyledHeader = styled(Header)`
  background-color: ${(p) => p.theme.lightGrey} !important;
  border-bottom: 1px solid ${(p) => p.theme.main};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
