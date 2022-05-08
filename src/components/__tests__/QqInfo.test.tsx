import {render,screen,cleanup,waitFor} from '@testing-library/react'
import QqInfo from "../QqInfo/src/QqInfo";
import {rest} from "msw";
import {setupServer} from "msw/node";

const server = setupServer(
    rest.get("https://api.uomg.com/api/qq.info",(req,res,ctx)=>{
        const qq =req.url.searchParams.get('qq');

        if (qq == "790975658"){
            return res(ctx.json({name:"Jack",qlogo:""}))
        }else{
            return res(
                ctx.status(301),
                ctx.set('Content-Type', 'application/json')
            )
        }
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
    render(<QqInfo qq="aaa" />);
    expect(screen.getByText("qq格式错误")).toBeTruthy();
})

test('should render loading before show the qqInfo of user',async ()=>{
    render(<QqInfo qq="790975658" />);
    const loadingElement = screen.getByTestId("loading");
    expect(loadingElement).toContainHTML('<img src="loading.gif" width="60" />');
    const qqInfoElement = await screen.findByTestId("qqInfo")
    expect(qqInfoElement).toHaveTextContent('Jack')
})

test('should render 请求错误 when request error',async ()=>{
    render(<QqInfo qq="123123" />);
    const httpElement = await screen.findByTestId("httpError")

    expect(httpElement).toHaveTextContent('请求错误')
})