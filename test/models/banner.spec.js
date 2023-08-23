const path = require('path');
global.appDir = path.join(__dirname, "../../")
const model = require(appDir+'/app/models/index');
const expect = require('chai').expect

describe('[Models] => Test Banners', () => {

    describe('Test Create Banner', () => {

        it('Test Create Banner Success', async () => {
            const data = {
                dashboard_id: 1,
                title: "banner contoh",
                description: "banner description contoh",
                status: "active",
                url: "https://click.pageads.me",
                image: `/snip-dev/banner/banner-23080811-35125480.png`
            }
            const Banner= await model.banner.create(data);
            
            expect(Banner.get("dashboard_id")).to.equal(data.dashboard_id);
            expect(Banner.get("title")).to.equal(data.title);
            expect(Banner.get("status")).to.equal(data.status);
            expect(Banner.get("url")).to.equal(data.url);
            expect(Banner.get("image")).to.equal(data.image);
            expect(Banner.get("image_url")).to.equal(`https://s3.smartcitynusantara.id`+data.image);
        });

        it('Test Create Banner Error', async () => {
            try {
                await model.banner.create({})
            } catch (error) {
                expect(error.message).to.equal(`Validation error`);
            }
        });

    });

});