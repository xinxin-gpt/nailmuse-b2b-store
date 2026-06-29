# GitHub + Vercel + Cloudflare R2 + Namecheap 部署说明

## 一、网站架构

```text
Namecheap 域名
      ↓
Vercel / Next.js 网站与 Serverless API
      ├── B2B 首页、产品页、OEM/ODM、批发、工厂、询盘
      ├── /admin/import 产品导入后台
      └── /api/admin/products/import 导入接口
      ↓
Cloudflare R2
      ├── catalog/products.json 动态产品库
      ├── catalog/backups/ 自动备份
      ├── products/ 产品图片
      └── catalogs/ PDF目录
```

产品导入成功后，前台直接读取 R2 中的产品库，不需要重新提交 GitHub，也不需要重新部署 Vercel。

## 二、先修改网站资料

打开 `lib/site.ts`，修改：

- 品牌名
- 公司名称
- 邮箱
- WhatsApp / 电话
- 公司地址
- 网站域名

8个示例产品保存在 `data/products.ts`。当 R2 尚未配置或产品目录读取失败时，网站会自动使用这些示例数据，避免前台空白。

## 三、上传 GitHub

```bash
git init
git add .
git commit -m "B2B nail website with bulk product import"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```

也可以在 GitHub 新建空仓库后，通过网页上传解压后的全部文件。

## 四、Vercel 部署

1. Vercel → Add New → Project
2. 导入 GitHub 仓库
3. Framework Preset 选择 Next.js
4. 添加下面的环境变量
5. 点击 Deploy

### 必需环境变量

```text
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_R2_PUBLIC_URL=https://assets.yourdomain.com

PRODUCT_IMPORT_ADMIN_TOKEN=请设置一个足够长的随机密码

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=nail-assets
R2_PRODUCTS_KEY=catalog/products.json
```

### 可选邮件变量

```text
RESEND_API_KEY=
INQUIRY_TO_EMAIL=sales@yourdomain.com
INQUIRY_FROM_EMAIL=Website Inquiry <website@yourdomain.com>
```

修改环境变量后需要重新部署一次，让 Vercel Function 读取新配置。

## 五、Cloudflare R2 配置

### 1. 创建 Bucket

Cloudflare Dashboard → R2 Object Storage → Create bucket，例如：

```text
nail-assets
```

### 2. 创建 R2 API Token

为该 Bucket 创建具备 Object Read & Write 权限的 API Token，把以下内容复制到 Vercel：

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
```

不要把这些密钥写入 GitHub。

### 3. 配置公开图片域名

给 R2 Bucket 绑定自定义域名，例如：

```text
assets.yourdomain.com
```

然后设置：

```text
NEXT_PUBLIC_R2_PUBLIC_URL=https://assets.yourdomain.com
```

产品 JSON 可以保持在同一个 Bucket 中。网站通过服务端密钥读取，图片通过公开域名显示。

## 六、批量上传产品图片

把图片整理到：

```text
public/products/
```

也可以在 `.env.local` 中指定其他目录：

```text
R2_UPLOAD_DIR=你的图片文件夹
R2_UPLOAD_PREFIX=products
```

执行：

```bash
npm install
cp .env.example .env.local
npm run r2:upload
```

上传完成后项目根目录会生成：

```text
r2-upload-manifest.csv
```

该文件包含图片公开地址，可复制到产品导入表格的 `image` 和 `images` 字段。

## 七、批量导入产品

部署后打开：

```text
https://你的域名/admin/import
```

1. 输入 `PRODUCT_IMPORT_ADMIN_TOKEN`
2. 下载 CSV 模板
3. 上传 CSV 或 XLSX
4. 点击“预检文件”
5. 检查错误行和警告
6. 选择“更新并新增”或“完全替换”
7. 点击“发布到产品库”

详细字段说明见：

```text
docs/BULK-IMPORT.zh-CN.md
```

## 八、Namecheap 域名连接 Vercel

1. Vercel → Project → Settings → Domains
2. 添加：
   - `yourdomain.com`
   - `www.yourdomain.com`
3. Namecheap → Domain List → Manage → Advanced DNS
4. 按 Vercel 给出的 A / CNAME 记录添加
5. 删除冲突的旧 A、CNAME 或 URL Redirect
6. DNS 生效后 Vercel 会自动配置 HTTPS

R2 图片子域名 `assets.yourdomain.com` 在 Cloudflare R2 中配置，不要把它指向 Vercel。

## 九、询盘邮件

网站询盘接口已存在。配置邮件服务后，将以下变量加入 Vercel：

```text
RESEND_API_KEY=
INQUIRY_TO_EMAIL=sales@yourdomain.com
INQUIRY_FROM_EMAIL=Website Inquiry <website@yourdomain.com>
```

未配置邮件服务时，表单可以验证和测试，但不会发送真实邮件。

## 十、上线检查

- 修改品牌、公司、邮箱、WhatsApp和地址
- 更换示例产品图
- 设置强管理员密码
- 确认 R2 Token 只具备所需 Bucket 权限
- 测试 CSV 和 XLSX 预检
- 用一条草稿产品测试导入
- 检查产品主图、多图、MOQ、交期和详情页
- 测试询盘邮件
- 配置 Google Search Console 和分析工具
- 不要在公开位置分享 `/admin/import` 密码
