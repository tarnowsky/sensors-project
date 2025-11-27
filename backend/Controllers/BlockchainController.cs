using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlockchainController : ControllerBase
{
    private readonly BlockchainService _blockchainService;
    private readonly ILogger<BlockchainController> _logger;

    public BlockchainController(BlockchainService blockchainService, ILogger<BlockchainController> logger)
    {
        _blockchainService = blockchainService;
        _logger = logger;
    }

    /// <summary>
    /// Get blockchain service status
    /// </summary>
    [HttpGet("status")]
    public ActionResult<BlockchainStatus> GetStatus()
    {
        return Ok(_blockchainService.GetStatus());
    }

    /// <summary>
    /// Get all sensor token balances
    /// </summary>
    [HttpGet("balances")]
    public async Task<ActionResult<List<SensorTokenBalance>>> GetAllBalances()
    {
        var balances = await _blockchainService.GetAllSensorBalancesAsync();
        return Ok(balances);
    }

    /// <summary>
    /// Get token balance for a specific sensor
    /// </summary>
    [HttpGet("balances/{sensorId}")]
    public async Task<ActionResult<SensorTokenBalance>> GetSensorBalance(int sensorId)
    {
        var wallet = await _blockchainService.GetOrCreateSensorWalletAsync(sensorId);
        var balance = await _blockchainService.GetSensorBalanceFromBlockchainAsync(sensorId);
        var transfers = await _blockchainService.GetSensorTransfersAsync(sensorId);

        return Ok(new SensorTokenBalance
        {
            SensorId = sensorId,
            WalletAddress = wallet.WalletAddress,
            Balance = balance,
            MessageCount = transfers.Count
        });
    }

    /// <summary>
    /// Get recent token transfers
    /// </summary>
    [HttpGet("transfers")]
    public async Task<ActionResult<List<TokenTransfer>>> GetRecentTransfers([FromQuery] int limit = 50)
    {
        var transfers = await _blockchainService.GetRecentTransfersAsync(Math.Min(limit, 100));
        return Ok(transfers);
    }

    /// <summary>
    /// Get token transfers for a specific sensor
    /// </summary>
    [HttpGet("transfers/{sensorId}")]
    public async Task<ActionResult<List<TokenTransfer>>> GetSensorTransfers(int sensorId, [FromQuery] int limit = 50)
    {
        var transfers = await _blockchainService.GetSensorTransfersAsync(sensorId, Math.Min(limit, 100));
        return Ok(transfers);
    }

    /// <summary>
    /// Get or create wallet for a sensor
    /// </summary>
    [HttpGet("wallets/{sensorId}")]
    public async Task<ActionResult<SensorWallet>> GetSensorWallet(int sensorId)
    {
        var wallet = await _blockchainService.GetOrCreateSensorWalletAsync(sensorId);
        return Ok(wallet);
    }
}
