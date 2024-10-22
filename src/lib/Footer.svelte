<div class="container">
	<div class="company_container">
		<div class="logo_container">
			<img class="logo" src={'/engineers/logo-light.svg'} alt="img" />
			<p class="text title">ReviewedBy</p>
		</div>
		<div class="mail_container">
			<img src="/mail.svg" class="icon_image" alt="mail" />
			<p class="text sub">support@reviewedby.app</p>
		</div>
<!--		<div class="socials">-->
<!--			<img src="/linkedin.svg" class="social_image" alt="mail" />-->
<!--			<img src="/instagram.svg" class="social_image" alt="mail" />-->
<!--			<img src="/x.svg" class="social_image" alt="mail" />-->
<!--		</div>-->
	</div>
	<div class="links_container">
		<a target="_blank" href="https://sites.google.com/view/reviewedby-privacy/home" class="link">Privacy Policy</a>
		<a target="_blank" href="https://sites.google.com/view/reviewedby-terms/home" class="link">Terms of Use</a>
	</div>
</div>

<style>
		.link {
				color: var(--light);
				text-decoration: none;
		}
		.links_container {
				display: flex;
				flex-direction: column;
				gap: 10px;
		}
		.company_container {

		}
		.social_image {
				width: 16px;
				height: 16px;
		}
		.socials {
				display: flex;
				gap: 10px;
				margin-left: 4px;
        margin-top: 20px;
		}
		.mail_container {
        display: flex; align-items: center; margin-left: 4px; margin-top: 16px
		}
		.sub {
        font-size: 16px;
        font-weight: 300;
				margin-left: 6px;
		}
		.icon_image {
				width: 16px;
				height: 16px;
		}
    .logo {
        height: 20px;
        width: 20px;
    }
    .logo_container {
        display: flex;
        align-items: center;
    }
    .title {
        margin-left: 5px;
        font-size: 18px;
        font-weight: 800;
    }
	.container {
			display: flex;
			background-color: var(--secondary_2);
			padding: 20px 40px 20px 20px;
			justify-content:space-between;
	}
    .text {
        color: var(--light);
    }
</style>
