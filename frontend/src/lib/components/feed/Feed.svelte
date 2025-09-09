<script lang="ts">

</script>

<div class="container">
    <Input placeholder="Login" bind:value={login}/>
	<Input placeholder="Password" bind:value={password} type="password"/>
    <TextButton text="Login" handleClick={LoginModelView.login(login, password)}/>
</div>

<style>
.container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      gap: 40px;
    }
</style>