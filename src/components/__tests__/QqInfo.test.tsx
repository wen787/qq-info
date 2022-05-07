import {render,screen,cleanup,waitFor} from '@testing-library/react'
import QqInfo from "../QqInfo/src/QqInfo";
import {rest} from "msw";
import {setupServer} from "msw/node";

const server = setupServer(
    rest.get("https://api.uomg.com/api/qq.info",(req,res,ctx)=>{
        req.params.qq = "790975658";
        return res(ctx.json({name:"Jack",qlogo:""}))
    })
)

beforeAll(() => server.listen());
afterAll(() => {
    server.close()
})

afterEach(()=>{
    cleanup();
    server.resetHandlers();
})

test('should render qq格式错误 when qq is not right',()=>{
    const {getByText} = render(<QqInfo qq="aaa" />);
    expect(getByText("qq格式错误")).toBeTruthy();
})

test('should render loading before show the qqInfo of user',async ()=>{
    render(<QqInfo qq="790975658" />);
    const loadingElement = screen.getByTestId("loading");
    expect(loadingElement).toContainHTML('<img src="loading.gif" width="60" />');
    const qqInfoElement = await waitFor(()=>screen.getByTestId("qqInfo"))
    expect(qqInfoElement).toHaveTextContent('Jack')
})